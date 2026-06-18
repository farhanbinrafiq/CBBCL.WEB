import React, { useState, useEffect } from "react";
import { RoutePath, User, Profile, Director, NewsPost, ClubMember, Affiliation, MembershipApplication, AffiliationRequest, FooterSettings } from "../../types";
import {
  getLoggedInUser,
  getUsers,
  saveUsers,
  getProfiles,
  saveProfiles,
  getBoardMembers,
  saveBoardMembers,
  getNewsPosts,
  saveNewsPosts
} from "../../utils/storage";
import { getClubMembers, saveClubMembers, getMembershipApplications, saveMembershipApplications, getAffiliationRequests, saveAffiliationRequests } from "../../utils/memberStorage";
import ImageUpload from "../ImageUpload";
import {
  getMediaLibrary,
  saveMediaLibrary,
  getPageContent,
  savePageContent,
  getCMSFacilities,
  saveCMSFacilities,
  getCMSEvents,
  saveCMSEvents,
  getCMSAffiliations,
  saveCMSAffiliations,
  MediaItem,
  PageCMSContent,
  getNavCMS,
  saveNavCMS,
  getFooterCMS,
  saveFooterCMS,
  getFooterSettingsSync,
  fetchFooterSettings,
  updateFooterSettings,
  NavCMSData,
  FooterCMSData,
  NavMenuItem
} from "../../utils/cmsStorage";
import {
  getHomeLayoutCMS,
  saveHomeLayoutCMS,
  syncImageToMediaLibrary,
  HomeCMSLayoutData
} from "../../utils/homeCmsStorage";
import {
  Anchor, ShieldAlert, CheckCircle, Users, FileText, LayoutGrid, Calendar, LogOut,
  UserCheck, ShieldX, Check, X, Megaphone, Trash2, Edit2, Plus, ArrowRight, Eye, ChevronRight,
  ChevronUp, ChevronDown, Move, Upload, Image as ImageIcon, BookOpen, MapPin, Contact, HardHat, Info, Copy,
  Award, ShieldCheck, Sliders, Layers, Menu, ChevronLeft
} from "lucide-react";

interface AdminDashboardProps {
  navigate: (path: RoutePath) => void;
  onLogout: () => void;
  initialActiveTab?: AdminTab;
}

type AdminTab = "members" | "profiles" | "board" | "news" | "club_members" | "site_content" | "media_library" | "affiliations" | "system" | "applications" | "affiliation_requests" | "home_cms" | "footer_cms";

const AVAILABLE_ROUTES: { label: string; value: RoutePath }[] = [
  { label: "Home Page", value: "/" },
  { label: "About Page", value: "/about.html" },
  { label: "Facilities Showcase", value: "/facilities.html" },
  { label: "Membership Qualifications", value: "/membership.html" },
  { label: "Governance Documents", value: "/governance.html" },
  { label: "Board of Directors Profile", value: "/board.html" },
  { label: "Club Members Registry", value: "/members.html" },
  { label: "Events & Festivals", value: "/events.html" },
  { label: "Club News Feed & Circulars", value: "/news-feed.html" },
  { label: "Affiliations Guide", value: "/affiliations.html" },
  { label: "Contact registry & Forms", value: "/contact.html" },
  { label: "Admin Console Panel", value: "/admin-dashboard" }
];

export default function AdminDashboard({ navigate, onLogout, initialActiveTab }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialActiveTab || "members");

  // Responsiveness States
  const [isTabletSidebarCollapsed, setIsTabletSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Local Storage States
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [boardMembers, setBoardMembers] = useState<Director[]>([]);
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [affiliationRequests, setAffiliationRequests] = useState<AffiliationRequest[]>([]);

  // Page Content dynamic states
  const [siteCms, setSiteCms] = useState<PageCMSContent>(getPageContent());
  const [homeCms, setHomeCms] = useState<HomeCMSLayoutData>(getHomeLayoutCMS());
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(getMediaLibrary());
  const [affiliations, setAffiliations] = useState<Affiliation[]>(getCMSAffiliations());
  const [navCms, setNavCms] = useState<NavCMSData>(getNavCMS());
  const [footerCms, setFooterCms] = useState<FooterCMSData>(getFooterCMS());

  // Club Members CMS Form States
  const [isClubMemberModalOpen, setIsClubMemberModalOpen] = useState(false);
  const [editingClubMember, setEditingClubMember] = useState<ClubMember | null>(null);
  const [clubMemberForm, setClubMemberForm] = useState({
    id: "",
    name: "",
    email: "",
    membershipType: "Life Member" as ClubMember["membershipType"],
    membershipCode: "",
    isAutoCode: true,
    status: "Active" as ClubMember["status"],
    joinDate: new Date().toISOString().split("T")[0],
    bio: "",
    achievements: "",
    clubInvolvement: "",
    avatarUrl: "",
    category: "General Member" as "Founding Member" | "Executive Officer" | "General Member"
  });

  // Admin Members Filters & Sorters
  const [adminMemberSearch, setAdminMemberSearch] = useState("");
  const [adminMemberCategoryFilter, setAdminMemberCategoryFilter] = useState("All");
  const [adminMemberSortBy, setAdminMemberSortBy] = useState<"name" | "category" | "code" | "joinDate">("name");

  // Notification Banner
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Rejection Dialog State
  const [rejectingProfileId, setRejectingProfileId] = useState<string | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");

  // Inspect profile State
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);

  // Manual membership editing State
  const [editingMembershipNumUser, setEditingMembershipNumUser] = useState<string | null>(null);
  const [tempMembershipNum, setTempMembershipNum] = useState("");

  // Board CMS Form State
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [editingBoardItem, setEditingBoardItem] = useState<Director | null>(null);
  const [boardForm, setBoardForm] = useState({
    id: "",
    name: "",
    designation: "",
    membershipCode: "",
    appointed: "",
    bio: "",
    company: "",
    role: "",
    industry: "",
    achievements: "",
    memberships: "",
    community: "",
    photoUrl: "",
    level: 4,
    orderIndex: 0,
    placement: "bottom"
  });

  // News CMS Form State
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsItem, setEditingNewsItem] = useState<NewsPost | null>(null);
  const [newsForm, setNewsForm] = useState({
    id: "",
    title: "",
    category: "News" as const,
    excerpt: "",
    content: "",
    tags: "",
    image: "",
    status: "Published" as "Published" | "Draft" | "Scheduled",
    scheduledDate: ""
  });

  // Affiliation Form State
  const [isAffModalOpen, setIsAffModalOpen] = useState(false);
  const [editingAffItem, setEditingAffItem] = useState<Affiliation | null>(null);
  const [affForm, setAffForm] = useState({
    id: "",
    name: "",
    partnershipType: "Reciprocal Club",
    country: "Bangladesh",
    website: "",
    logoUrl: ""
  });

  // Media Library General image upload helper State
  const [tempMediaFile, setTempMediaFile] = useState("");
  const [tempMediaName, setTempMediaName] = useState("");
  const [tempMediaCat, setTempMediaCat] = useState<MediaItem["category"]>("Gallery");

  // Dynamic Footer Settings CMS state
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(() => getFooterSettingsSync());

  useEffect(() => {
    const adminUser = getLoggedInUser();
    if (!adminUser || adminUser.role !== "admin") {
      navigate("/login.html");
      return;
    }

    setUsers(getUsers());
    setProfiles(getProfiles());
    setBoardMembers(getBoardMembers());
    setNewsPosts(getNewsPosts());
    setClubMembers(getClubMembers());
    setApplications(getMembershipApplications());
    setAffiliationRequests(getAffiliationRequests());
    setSiteCms(getPageContent());
    setMediaLibrary(getMediaLibrary());
    setAffiliations(getCMSAffiliations());

    // Sync dynamic footer custom site settings
    fetchFooterSettings().then(res => {
      if (res && res.socialLinks) {
        setFooterSettings(res);
      }
    });
  }, [navigate]);

  const triggerNotice = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // --- FOOTER CMS ACTIONS ---
  const handleResetFooterToDefault = () => {
    const DEFAULT_F_SETTINGS: FooterSettings = {
      key: "footer",
      socialLinks: {
        facebook: "https://www.facebook.com/CoxsBazarBoatClubLtd",
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        linkedin: "https://www.linkedin.com/company/cbbcl/",
        twitter: "https://twitter.com"
      },
      contact: {
        email: "registry@cbbcl.org, admin@cbbcl.org",
        phone: "+880 1711-223344",
        address: "Coastal Point Bypass, Marine Drive Boulevard, Cox's Bazar, Bangladesh"
      },
      footerLinks: [
        {
          title: "Explore the Club",
          links: [
            { name: "Home Base", url: "/" },
            { name: "About Our Story", url: "/about.html" },
            { name: "Facilities Showcase", url: "/facilities.html" },
            { name: "Board of Directors", url: "/board.html" },
            { name: "Club News Feed", url: "/news-feed.html" },
            { name: "Affiliations", url: "/affiliations.html" }
          ]
        },
        {
          title: "Membership Tiers",
          links: [
            { name: "🏆 Donor Membership", url: "/membership.html" },
            { name: "🏵️ Life Membership", url: "/membership.html" },
            { name: "🛡️ Permanent Membership", url: "/membership.html" },
            { name: "⚓ Associate Membership", url: "/membership.html" }
          ]
        }
      ],
      legalLinks: [
        { name: "Privacy Policy", url: "/about.html" },
        { name: "Terms of Service", url: "/about.html" }
      ],
      copyright: "© 2026 Cox's Bazar Boat Club Limited. All Rights Reserved. Incorporated under The Companies Act, 1994, Bangladesh."
    };
    setFooterSettings(DEFAULT_F_SETTINGS);
    triggerNotice("success", "Footer parameters reset to original defaults. Click Save to commit changes.");
  };

  const handleUpdateGroupTitle = (groupIdx: number, newTitle: string) => {
    const updated = [...footerSettings.footerLinks];
    updated[groupIdx].title = newTitle;
    setFooterSettings({ ...footerSettings, footerLinks: updated });
  };

  const handleUpdateGroupLink = (groupIdx: number, linkIdx: number, key: "name" | "url", value: string) => {
    const updatedCol = [...footerSettings.footerLinks];
    const updatedLink = { ...updatedCol[groupIdx].links[linkIdx], [key]: value };
    updatedCol[groupIdx].links[linkIdx] = updatedLink;
    setFooterSettings({ ...footerSettings, footerLinks: updatedCol });
  };

  const handleAddGroupLink = (groupIdx: number) => {
    const updated = [...footerSettings.footerLinks];
    updated[groupIdx].links.push({ name: "", url: "" });
    setFooterSettings({ ...footerSettings, footerLinks: updated });
  };

  const handleRemoveGroupLink = (groupIdx: number, linkIdx: number) => {
    const updated = [...footerSettings.footerLinks];
    updated[groupIdx].links.splice(linkIdx, 1);
    setFooterSettings({ ...footerSettings, footerLinks: updated });
  };

  const handleAddFooterLinkGroup = () => {
    const updated = [...footerSettings.footerLinks];
    updated.push({ title: "New Column Category", links: [] });
    setFooterSettings({ ...footerSettings, footerLinks: updated });
  };

  const handleRemoveFooterLinkGroup = (groupIdx: number) => {
    const updated = [...footerSettings.footerLinks];
    updated.splice(groupIdx, 1);
    setFooterSettings({ ...footerSettings, footerLinks: updated });
  };

  const handleUpdateLegalLink = (legalIdx: number, key: "name" | "url", value: string) => {
    const updated = [...footerSettings.legalLinks];
    updated[legalIdx] = { ...updated[legalIdx], [key]: value };
    setFooterSettings({ ...footerSettings, legalLinks: updated });
  };

  const handleAddLegalLink = () => {
    const updated = [...footerSettings.legalLinks];
    updated.push({ name: "", url: "" });
    setFooterSettings({ ...footerSettings, legalLinks: updated });
  };

  const handleRemoveLegalLink = (legalIdx: number) => {
    const updated = [...footerSettings.legalLinks];
    updated.splice(legalIdx, 1);
    setFooterSettings({ ...footerSettings, legalLinks: updated });
  };

  // --- AFFILIATION REQUEST ACTIONS ---
  const handleApproveAffiliation = (reqId: string) => {
    const updated = affiliationRequests.map(req => {
      if (req.id === reqId) {
        return { ...req, status: "approved" as const };
      }
      return req;
    });
    saveAffiliationRequests(updated);
    setAffiliationRequests(updated);
    triggerNotice("success", "Affiliation clearance request approved successfully! Introduction travel pass generated.");
  };

  const handleRejectAffiliation = (reqId: string) => {
    const updated = affiliationRequests.map(req => {
      if (req.id === reqId) {
        return { ...req, status: "rejected" as const };
      }
      return req;
    });
    saveAffiliationRequests(updated);
    setAffiliationRequests(updated);
    triggerNotice("success", "Affiliation clearance request rejected.");
  };

  // --- MEMBER STATUS ACTIONS ---
  const handleVerifyNumber = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, membershipNumber: tempMembershipNum, status: "approved" as const, role: "verified" as const };
      }
      return u;
    });
    saveUsers(updated);
    setUsers(updated);
    setEditingMembershipNumUser(null);
    setTempMembershipNum("");
    triggerNotice("success", "Member credentials verified, role set to 'verified', and account approved!");
  };

  const handleApproveUser = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const finalNum = u.membershipNumber || `CBBCL-MEMBER-${Math.floor(100 + Math.random() * 900)}`;
        return {
          ...u,
          status: "approved" as const,
          role: "verified" as const,
          membershipNumber: finalNum
        };
      }
      return u;
    });
    saveUsers(updated);
    setUsers(updated);
    triggerNotice("success", "User verified and role elevated to Verified Member.");
  };

  const handleRejectUser = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: "rejected" as const, role: "member" as const };
      }
      return u;
    });
    saveUsers(updated);
    setUsers(updated);
    triggerNotice("error", "Member registration request rejected.");
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: "pending" | "under_verification" | "approved" | "rejected") => {
    const updated = applications.map((app) => {
      if (app.id === appId) {
        if (newStatus === "approved" && app.status !== "approved") {
          let normType: ClubMember["membershipType"] = "Life Member";
          if (app.membershipType.includes("Life")) normType = "Life Member";
          else if (app.membershipType.includes("Donor")) normType = "Donor Member";
          else if (app.membershipType.includes("Permanent")) normType = "Permanent Member";
          else if (app.membershipType.includes("Associate")) normType = "Associate Member";
          else if (app.membershipType.includes("Honorary")) normType = "Honorary Member";

          const nextCode = generateNextMembershipCode(normType, clubMembers);
          const newMemberId = "member-" + Date.now();
          const newMember: ClubMember = {
            id: newMemberId,
            name: app.fullName,
            email: app.email,
            membershipType: normType,
            membershipCode: nextCode,
            status: "Active",
            joinDate: new Date().toISOString().split("T")[0],
            order: clubMembers.length,
            bio: app.motivation || `Nominated and approved through official central registry credentials as a ${normType}.`,
            clubInvolvement: `Approved on board proposal review from ${app.organization || "Private sector"}.`
          };
          const updatedMembers = [...clubMembers, newMember];
          saveClubMembers(updatedMembers);
          setClubMembers(updatedMembers);
          triggerNotice("success", `Approved ${app.fullName}! Added to Club Directory with code ${nextCode}`);
        } else if (newStatus === "rejected") {
          triggerNotice("error", `Rejected nomination for ${app.fullName}.`);
        } else if (newStatus === "under_verification") {
          triggerNotice("success", `Nomination for ${app.fullName} is now Under Verification.`);
        }
        return { ...app, status: newStatus };
      }
      return app;
    });

    saveMembershipApplications(updated);
    setApplications(updated);
  };

  // --- PROFILE APPROVAL QUEUE ACTIONS ---
  const handleApproveProfile = (profileUserId: string) => {
    const updatedProfiles = profiles.map((p) => {
      if (p.userId === profileUserId) {
        return { ...p, profileStatus: "approved" as const };
      }
      return p;
    });
    saveProfiles(updatedProfiles);
    setProfiles(updatedProfiles);

    const updatedUsers = users.map((u) => {
      if (u.id === profileUserId) {
        return { ...u, role: "verified" as const, status: "approved" as const };
      }
      return u;
    });
    saveUsers(updatedUsers);
    setUsers(updatedUsers);

    triggerNotice("success", "ProfileApproved: Member credentials published to directories successfully!");
    setViewingProfile(null);
  };

  const handleOpenRejectProfile = (userId: string) => {
    setRejectingProfileId(userId);
    setRejectionComment("");
  };

  const handleConfirmProfileRejection = () => {
    if (!rejectingProfileId) return;

    const updatedProfiles = profiles.map((p) => {
      if (p.userId === rejectingProfileId) {
        return { ...p, profileStatus: "rejected" as const, rejectionComment };
      }
      return p;
    });
    saveProfiles(updatedProfiles);
    setProfiles(updatedProfiles);
    setRejectingProfileId(null);
    triggerNotice("error", "Profile returned to draft state with revision notes.");
    setViewingProfile(null);
  };

  // --- BOARD CMS CRUD ---
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const normalizeOrderIndexes = (members: Director[]): Director[] => {
    const result: Director[] = [];
    [1, 2, 3, 4].forEach(levelVal => {
      const levelItems = members
        .filter(d => (d.level ?? 4) === levelVal)
        .sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
      
      levelItems.forEach((item, idx) => {
        result.push({ ...item, level: levelVal, orderIndex: idx });
      });
    });

    const otherItems = members.filter(d => !d.level || d.level < 1 || d.level > 4);
    return [...result, ...otherItems];
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnLane = (targetLevel: number) => {
    if (!draggedId) return;
    const item = boardMembers.find(d => d.id === draggedId);
    if (!item) return;

    if (item.level !== targetLevel) {
      const targetItems = boardMembers.filter(d => (d.level ?? 4) === targetLevel).sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
      const newOrderIndex = targetItems.length;

      const updated = boardMembers.map(d => {
        if (d.id === draggedId) {
          return { ...d, level: targetLevel, orderIndex: newOrderIndex };
        }
        return d;
      });

      const normalized = normalizeOrderIndexes(updated);
      saveBoardMembers(normalized);
      setBoardMembers(normalized);
      setDraggedId(null);
      triggerNotice("success", `Moved ${item.name} to Tier Row ${targetLevel}.`);
    } else {
      setDraggedId(null);
    }
  };

  const handleDropOnCard = (e: React.DragEvent, targetId: string, targetLevel: number) => {
    e.stopPropagation();
    if (!draggedId || draggedId === targetId) return;

    const draggedItem = boardMembers.find(d => d.id === draggedId);
    const targetItem = boardMembers.find(d => d.id === targetId);
    if (!draggedItem || !targetItem) return;

    const laneItems = boardMembers
      .filter(d => (d.level ?? 4) === targetLevel && d.id !== draggedId)
      .sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

    const targetIndex = laneItems.findIndex(d => d.id === targetId);

    const newLaneItems = [...laneItems];
    if (targetIndex !== -1) {
      newLaneItems.splice(targetIndex, 0, { ...draggedItem, level: targetLevel });
    } else {
      newLaneItems.push({ ...draggedItem, level: targetLevel });
    }

    newLaneItems.forEach((d, idx) => {
      d.orderIndex = idx;
    });

    const updated = boardMembers.map(d => {
      if (d.id === draggedId) {
        return { ...d, level: targetLevel, orderIndex: newLaneItems.find(x => x.id === draggedId)?.orderIndex ?? 0 };
      }
      const laneMatch = newLaneItems.find(x => x.id === d.id);
      if (laneMatch) {
        return { ...d, orderIndex: laneMatch.orderIndex };
      }
      return d;
    });

    const normalized = normalizeOrderIndexes(updated);
    saveBoardMembers(normalized);
    setBoardMembers(normalized);
    setDraggedId(null);
    triggerNotice("success", `Reordered board hierarchy sequence.`);
  };

  const handleQuickMove = (id: string, direction: "up" | "down") => {
    const item = boardMembers.find(d => d.id === id);
    if (!item || item.level === undefined) return;

    const currentLevel = item.level;
    const levelItems = boardMembers
      .filter((d) => (d.level ?? 4) === currentLevel)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

    const currentIndex = levelItems.findIndex((d) => d.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= levelItems.length) return;

    const swapItem = levelItems[targetIndex];
    
    const updated = boardMembers.map((d) => {
      if (d.id === id) {
        return { ...d, orderIndex: swapItem.orderIndex };
      }
      if (d.id === swapItem.id) {
        return { ...d, orderIndex: item.orderIndex };
      }
      return d;
    });

    const normalized = normalizeOrderIndexes(updated);
    saveBoardMembers(normalized);
    setBoardMembers(normalized);
    triggerNotice("success", `Shifted list indices successfully.`);
  };

  const handleOpenBoardModal = (item?: Director) => {
    if (item) {
      setEditingBoardItem(item);
      setBoardForm({
        id: item.id,
        name: item.name,
        designation: item.designation,
        membershipCode: item.membershipCode || "",
        appointed: item.appointed || "",
        bio: item.bio ? item.bio.join("\n") : "",
        company: item.businessProfile?.company || "",
        role: item.businessProfile?.role || "",
        industry: item.businessProfile?.industry || "",
        achievements: item.achievements ? item.achievements.join(", ") : "",
        memberships: item.memberships ? item.memberships.join(", ") : "",
        community: item.community ? item.community.join(", ") : "",
        photoUrl: item.photoUrl || "",
        level: item.level !== undefined ? item.level : 4,
        orderIndex: item.orderIndex !== undefined ? item.orderIndex : 0,
        placement: "custom"
      });
    } else {
      setEditingBoardItem(null);
      setBoardForm({
        id: "bd-" + Date.now(),
        name: "",
        designation: "Founding Director",
        membershipCode: `CBBCL-FOUNDER-0${boardMembers.length + 1}`,
        appointed: "January 2026",
        bio: "",
        company: "",
        role: "",
        industry: "",
        achievements: "",
        memberships: "",
        community: "",
        photoUrl: "",
        level: 4,
        orderIndex: boardMembers.filter(d => (d.level ?? 4) === 4).length,
        placement: "bottom"
      });
    }
    setIsBoardModalOpen(true);
  };

  const handleSaveBoardItem = (e: React.FormEvent) => {
    e.preventDefault();
    const achievementsArr = boardForm.achievements.split(",").map((s) => s.trim()).filter((s) => s !== "");
    const membershipsArr = boardForm.memberships.split(",").map((s) => s.trim()).filter((s) => s !== "");
    const communityArr = boardForm.community.split(",").map((s) => s.trim()).filter((s) => s !== "");

    let finalOrderIndex = Number(boardForm.orderIndex);
    if (!editingBoardItem) {
      if (boardForm.placement === "top") {
        finalOrderIndex = -1;
      } else if (boardForm.placement === "bottom") {
        finalOrderIndex = 999;
      }
    }

    const newDirector: Director = {
      id: boardForm.id || "bd-" + Date.now(),
      name: boardForm.name,
      designation: boardForm.designation,
      membershipCode: boardForm.membershipCode,
      appointed: boardForm.appointed,
      photoUrl: boardForm.photoUrl,
      bio: boardForm.bio ? boardForm.bio.split("\n").filter((l) => l.trim() !== "") : undefined,
      businessProfile: boardForm.company ? {
        company: boardForm.company,
        role: boardForm.role,
        industry: boardForm.industry
      } : undefined,
      achievements: achievementsArr.length > 0 ? achievementsArr : undefined,
      memberships: membershipsArr.length > 0 ? membershipsArr : undefined,
      community: communityArr.length > 0 ? communityArr : undefined,
      level: Number(boardForm.level),
      orderIndex: finalOrderIndex
    };

    let updated: Director[];
    if (editingBoardItem) {
      updated = boardMembers.map((d) => (d.id === editingBoardItem.id ? newDirector : d));
    } else {
      updated = [...boardMembers, newDirector];
    }

    const normalized = normalizeOrderIndexes(updated);
    saveBoardMembers(normalized);
    setBoardMembers(normalized);
    setIsBoardModalOpen(false);
    triggerNotice("success", editingBoardItem ? "Board card specs edited." : "New Founding Board card published.");
  };

  const handleDeleteBoardItem = (id: string) => {
    const updated = boardMembers.filter((d) => d.id !== id);
    const normalized = normalizeOrderIndexes(updated);
    saveBoardMembers(normalized);
    setBoardMembers(normalized);
    triggerNotice("error", "Board card deleted from registry.");
  };

  // --- NEWS CMS CRUD ---
  const handleOpenNewsModal = (post?: NewsPost) => {
    if (post) {
      setEditingNewsItem(post);
      setNewsForm({
        id: post.id,
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags.join(", "),
        image: post.image || "",
        status: post.status || "Published",
        scheduledDate: post.scheduledDate || ""
      });
    } else {
      setEditingNewsItem(null);
      setNewsForm({
        id: "news-" + Date.now(),
        title: "",
        category: "News",
        excerpt: "",
        content: "",
        tags: "Gazette, Pier",
        image: "",
        status: "Published",
        scheduledDate: ""
      });
    }
    setIsNewsModalOpen(true);
  };

  const handleSaveNewsPost = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArr = newsForm.tags.split(",").map((s) => s.trim()).filter((s) => s !== "");

    const newPost: NewsPost = {
      id: newsForm.id || "news-" + Date.now(),
      title: newsForm.title,
      category: newsForm.category,
      excerpt: newsForm.excerpt,
      content: newsForm.content,
      tags: tagArr,
      image: newsForm.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400",
      date: new Date().toISOString().split("T")[0],
      year: "2026",
      month: "June",
      likes: editingNewsItem ? editingNewsItem.likes : 0,
      commentsCount: editingNewsItem ? editingNewsItem.commentsCount : 0,
      status: newsForm.status,
      scheduledDate: newsForm.status === "Scheduled" ? newsForm.scheduledDate : undefined
    };

    let updated: NewsPost[];
    if (editingNewsItem) {
      updated = newsPosts.map((p) => (p.id === editingNewsItem.id ? newPost : p));
    } else {
      updated = [newPost, ...newsPosts];
    }

    saveNewsPosts(updated);
    setNewsPosts(updated);
    setIsNewsModalOpen(false);
    triggerNotice("success", editingNewsItem ? "Gazette release updated." : "New Gazette post dispatched.");
  };

  const handleDeleteNewsPost = (id: string) => {
    const updated = newsPosts.filter((p) => p.id !== id);
    saveNewsPosts(updated);
    setNewsPosts(updated);
    triggerNotice("error", "Gazette post removed from registry.");
  };

  // --- CLUB MEMBERS CMS HANDLERS ---
  const generateNextMembershipCode = (
    type: "Life Member" | "Permanent Member" | "Associate Member" | "Donor Member" | "Honorary Member",
    currentList: ClubMember[]
  ) => {
    const typeCode = type.replace(" Member", "").toUpperCase();
    const matching = currentList.filter(m => m.membershipType === type);
    let maxNum = 0;
    matching.forEach(m => {
      const parts = m.membershipCode.split("-");
      const last = parts[parts.length - 1];
      const num = parseInt(last, 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    });
    const nextNum = maxNum + 1;
    const paddedStr = String(nextNum).padStart(3, "0");
    return `CBBCL-${typeCode}-${paddedStr}`;
  };

  const handleOpenClubMemberModal = (member?: ClubMember) => {
    if (member) {
      setEditingClubMember(member);
      setClubMemberForm({
        id: member.id,
        name: member.name,
        email: member.email || "",
        membershipType: member.membershipType,
        membershipCode: member.membershipCode,
        isAutoCode: false,
        status: member.status,
        joinDate: member.joinDate,
        bio: member.bio || "",
        achievements: member.achievements || "",
        clubInvolvement: member.clubInvolvement || "",
        avatarUrl: member.avatarUrl || "",
        category: member.category || "General Member"
      });
    } else {
      setEditingClubMember(null);
      const defaultType = "Life Member" as const;
      const autoCode = generateNextMembershipCode(defaultType, clubMembers);
      setClubMemberForm({
        id: "",
        name: "",
        email: "",
        membershipType: defaultType,
        membershipCode: autoCode,
        isAutoCode: true,
        status: "Active" as const,
        joinDate: new Date().toISOString().split("T")[0],
        bio: "",
        achievements: "",
        clubInvolvement: "",
        avatarUrl: "",
        category: "General Member"
      });
    }
    setIsClubMemberModalOpen(true);
  };

  const handleClubMemberTypeChange = (type: ClubMember["membershipType"]) => {
    if (clubMemberForm.isAutoCode) {
      const autoCode = generateNextMembershipCode(type, clubMembers);
      setClubMemberForm({
        ...clubMemberForm,
        membershipType: type,
        membershipCode: autoCode
      });
    } else {
      setClubMemberForm({
        ...clubMemberForm,
        membershipType: type
      });
    }
  };

  const handleSaveClubMember = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clubMemberForm.name.trim()) {
      triggerNotice("error", "Member full name is required.");
      return;
    }

    if (!clubMemberForm.membershipCode.trim()) {
      triggerNotice("error", "Membership unique code is required.");
      return;
    }

    const isCodeTaken = clubMembers.some(
      (m) =>
        m.membershipCode.toLowerCase() === clubMemberForm.membershipCode.toLowerCase() &&
        m.id !== clubMemberForm.id
    );

    if (isCodeTaken) {
      triggerNotice("error", `The registry code ${clubMemberForm.membershipCode} is already assigned to another member.`);
      return;
    }

    const savedId = clubMemberForm.id || "member-" + Date.now();
    
    const categoryValue = clubMemberForm.category || "General Member";
    let roleTypeValue: "FoundingMember" | "ExecutiveOfficer" | "RegularMember" = "RegularMember";
    if (categoryValue === "Founding Member") {
      roleTypeValue = "FoundingMember";
    } else if (categoryValue === "Executive Officer") {
      roleTypeValue = "ExecutiveOfficer";
    }

    const preparedMember: ClubMember = {
      id: savedId,
      name: clubMemberForm.name,
      email: clubMemberForm.email || undefined,
      membershipType: clubMemberForm.membershipType,
      membershipCode: clubMemberForm.membershipCode,
      status: clubMemberForm.status,
      joinDate: clubMemberForm.joinDate || new Date().toISOString().split("T")[0],
      order: editingClubMember ? editingClubMember.order : clubMembers.length,
      bio: clubMemberForm.bio || undefined,
      achievements: clubMemberForm.achievements || undefined,
      clubInvolvement: clubMemberForm.clubInvolvement || undefined,
      avatarUrl: clubMemberForm.avatarUrl || undefined,
      category: categoryValue,
      roleType: roleTypeValue
    };

    let updatedList: ClubMember[];
    if (editingClubMember) {
      updatedList = clubMembers.map((m) => (m.id === editingClubMember.id ? preparedMember : m));
    } else {
      updatedList = [...clubMembers, preparedMember];
    }

    saveClubMembers(updatedList);
    setClubMembers(getClubMembers());
    setIsClubMemberModalOpen(false);
    triggerNotice("success", editingClubMember ? "Member profile updated successfully." : "New member record registered successfully.");
  };

  const handleDeleteClubMember = (id: string) => {
    const updated = clubMembers.filter((m) => m.id !== id);
    saveClubMembers(updated);
    setClubMembers(getClubMembers());
    triggerNotice("error", "Member record permanently key deleted.");
  };

  const handleToggleMemberStatus = (id: string, newStatus: ClubMember["status"]) => {
    const updated = clubMembers.map((m) => {
      if (m.id === id) {
        return { ...m, status: newStatus };
      }
      return m;
    });
    saveClubMembers(updated);
    setClubMembers(getClubMembers());
    triggerNotice("success", `Registry status shifted to ${newStatus}.`);
  };

  // --- EXTRA DYNAMIC PAGES CMS HANDLERS ---
  const [siteSubTab, setSiteSubTab] = useState<"pages" | "navigation" | "footer">("pages");

  const [newRootLabel, setNewRootLabel] = useState("");
  const [newRootPath, setNewRootPath] = useState<RoutePath>("/");
  const [newDropLabels, setNewDropLabels] = useState<{ [key: number]: string }>({});
  const [newDropSubs, setNewDropSubs] = useState<{ [key: number]: string }>({});
  const [newFooterQLText, setNewFooterQLText] = useState("");
  const [newFooterQLPath, setNewFooterQLPath] = useState<RoutePath>("/");
  const [newFooterMemText, setNewFooterMemText] = useState("");

  const handleSavePageSettings = (e: React.FormEvent) => {
    e.preventDefault();
    savePageContent(siteCms);
    triggerNotice("success", "Global Core Site dynamic content saved securely!");
  };

  const handleSaveNavSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveNavCMS(navCms);
    triggerNotice("success", "Navigation Header CMS saved & published live!");
  };

  const handleSaveFooterSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveFooterCMS(footerCms);
    triggerNotice("success", "Footer CMS layout & branding published live!");
  };

  const updateMenuItemLabel = (index: number, val: string) => {
    const updated = { ...navCms };
    updated.menuItems[index].label = val;
    setNavCms(updated);
  };

  const updateMenuItemPath = (index: number, val: RoutePath) => {
    const updated = { ...navCms };
    updated.menuItems[index].path = val;
    setNavCms(updated);
  };

  const removeMenuItem = (index: number) => {
    const updated = { ...navCms };
    updated.menuItems.splice(index, 1);
    setNavCms(updated);
  };

  const moveMenuItem = (index: number, dir: "up" | "down") => {
    const newIndex = dir === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= navCms.menuItems.length) return;
    const updated = { ...navCms };
    const temp = updated.menuItems[index];
    updated.menuItems[index] = updated.menuItems[newIndex];
    updated.menuItems[newIndex] = temp;
    setNavCms(updated);
  };

  const addDropdownItem = (menuIndex: number) => {
    const label = newDropLabels[menuIndex] || "";
    const sub = newDropSubs[menuIndex] || "";
    if (!label) return;
    const updated = { ...navCms };
    if (!updated.menuItems[menuIndex].dropdown) {
      updated.menuItems[menuIndex].dropdown = [];
    }
    updated.menuItems[menuIndex].dropdown!.push({ label, sub });
    setNavCms(updated);
    setNewDropLabels({ ...newDropLabels, [menuIndex]: "" });
    setNewDropSubs({ ...newDropSubs, [menuIndex]: "" });
  };

  const removeDropdownItem = (menuIndex: number, dropIndex: number) => {
    const updated = { ...navCms };
    if (updated.menuItems[menuIndex].dropdown) {
      updated.menuItems[menuIndex].dropdown!.splice(dropIndex, 1);
      if (updated.menuItems[menuIndex].dropdown!.length === 0) {
        delete updated.menuItems[menuIndex].dropdown;
      }
    }
    setNavCms(updated);
  };

  const addNewRootMenuItem = () => {
    if (!newRootLabel) return;
    const updated = { ...navCms };
    updated.menuItems.push({ label: newRootLabel, path: newRootPath });
    setNavCms(updated);
    setNewRootLabel("");
  };

  const addFooterQuickLink = () => {
    if (!newFooterQLText) return;
    const updated = { ...footerCms };
    updated.quickLinks.push({ label: newFooterQLText, path: newFooterQLPath });
    setFooterCms(updated);
    setNewFooterQLText("");
  };

  const removeFooterQuickLink = (index: number) => {
    const updated = { ...footerCms };
    updated.quickLinks.splice(index, 1);
    setFooterCms(updated);
  };

  const moveFooterQuickLink = (index: number, dir: "up" | "down") => {
    const newIndex = dir === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= footerCms.quickLinks.length) return;
    const updated = { ...footerCms };
    const temp = updated.quickLinks[index];
    updated.quickLinks[index] = updated.quickLinks[newIndex];
    updated.quickLinks[newIndex] = temp;
    setFooterCms(updated);
  };

  const addFooterMembershipLink = () => {
    if (!newFooterMemText) return;
    const updated = { ...footerCms };
    updated.membershipLinks.push(newFooterMemText);
    setFooterCms(updated);
    setNewFooterMemText("");
  };

  const removeFooterMembershipLink = (index: number) => {
    const updated = { ...footerCms };
    updated.membershipLinks.splice(index, 1);
    setFooterCms(updated);
  };

  // --- CENTRAL MEDIA LIBRARY HANDLERS ---
  const handleAddNewMediaItem = () => {
    if (!tempMediaFile) {
      alert("Please upload/drag an image first.");
      return;
    }
    const slugName = tempMediaName.trim() || `Asset-${Date.now()}`;
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      name: slugName,
      url: tempMediaFile,
      category: tempMediaCat,
      uploadedAt: new Date().toISOString()
    };
    const updated = [newItem, ...mediaLibrary];
    saveMediaLibrary(updated);
    setMediaLibrary(updated);

    // reset fields
    setTempMediaFile("");
    setTempMediaName("");
    triggerNotice("success", `Image '${slugName}' saved dynamically to Central Media Library!`);
  };

  const handleDeleteMediaItem = (id: string) => {
    const updated = mediaLibrary.filter(m => m.id !== id);
    saveMediaLibrary(updated);
    setMediaLibrary(updated);
    triggerNotice("error", "Image removed from central media index.");
  };

  const handleCopyBase64 = (base64: string) => {
    navigator.clipboard.writeText(base64);
    triggerNotice("success", "Base64 Image DataURL copied to clipboard! You can paste in inputs.");
  };

  // --- PARTNER AFFILIATIONS CRUD ---
  const handleOpenAffModal = (item?: Affiliation) => {
    if (item) {
      setEditingAffItem(item);
      setAffForm({
        id: item.id,
        name: item.name,
        partnershipType: item.partnershipType,
        country: item.country || "Bangladesh",
        website: item.website || "",
        logoUrl: item.logo || ""
      });
    } else {
      setEditingAffItem(null);
      setAffForm({
        id: `aff-${Date.now()}`,
        name: "",
        partnershipType: "Reciprocal Club",
        country: "Bangladesh",
        website: "",
        logoUrl: ""
      });
    }
    setIsAffModalOpen(true);
  };

  const handleSaveAffiliation = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Affiliation = {
      id: affForm.id,
      name: affForm.name,
      description: affForm.partnershipType + " alliance with " + affForm.name,
      partnershipType: affForm.partnershipType,
      country: affForm.country,
      website: affForm.website,
      logo: affForm.logoUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=100"
    };

    let updated: Affiliation[];
    if (editingAffItem) {
      updated = affiliations.map(a => a.id === editingAffItem.id ? item : a);
    } else {
      updated = [...affiliations, item];
    }
    saveCMSAffiliations(updated);
    setAffiliations(updated);
    setIsAffModalOpen(false);
    triggerNotice("success", "Alliance partners list updated.");
  };

  const handleDeleteAffiliation = (id: string) => {
    const updated = affiliations.filter(a => a.id !== id);
    saveCMSAffiliations(updated);
    setAffiliations(updated);
    triggerNotice("error", "Affiliated alliance record removed.");
  };

  const handleLogOutAction = () => {
    onLogout();
    navigate("/login.html");
  };

  return (
    <div className="bg-bg-secondary min-h-screen pb-24">
      {/* Editorial Header */}
      <section className="bg-navy py-10 px-6 text-white border-b border-gold/25 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gold/10 rounded-full border border-gold/45 text-gold">
              <Anchor className="w-7 h-7" />
            </div>
            <div>
              <span className="font-sans text-[10px] text-gold uppercase tracking-[0.25em] font-bold block">
                Central Registry Core Console
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-light text-white tracking-tight mt-0.5">
                Cox's Bazar Boat Club Limited CMS
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogOutAction}
            className="flex items-center space-x-2 bg-navy-mid hover:bg-gold hover:text-navy text-white text-[11px] font-sans font-bold uppercase tracking-widest px-5 py-3 border border-white/20 hover:border-gold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Close Console Connection</span>
          </button>
        </div>
      </section>

      {/* Mobile Top Navigation Sticky bar - only visible on small screens (< md) */}
      <section className="bg-white border-b border-slate-200 px-6 py-4 md:hidden flex items-center justify-between sticky top-[68px] z-30 shadow-sm">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Open Console Navigation Menu"
            id="admin-mobile-hamburger"
          >
            <Menu className="w-5 h-5 text-navy" />
          </button>
          <div>
            <span className="font-sans text-[8px] uppercase tracking-wider text-gold-dark font-bold block">
              Active Module
            </span>
            <span className="font-sans text-xs font-bold text-navy truncate max-w-[150px] inline-block">
              {activeTab === "members" && "Member Verifications"}
              {activeTab === "profiles" && "Profile Approvals"}
              {activeTab === "applications" && "Admissions Nominations"}
              {activeTab === "affiliation_requests" && "Reciprocal Requests"}
              {activeTab === "home_cms" && "Home CMS"}
              {activeTab === "footer_cms" && "Footer CMS"}
              {activeTab === "site_content" && "Pages Content"}
              {activeTab === "board" && "Board Hierarchy"}
              {activeTab === "news" && "News Feed CMS"}
              {activeTab === "affiliations" && "Reciprocal Alliances"}
              {activeTab === "club_members" && "Members Directory"}
              {activeTab === "media_library" && "Media Library"}
              {activeTab === "system" && "Diagnostics"}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {users.filter(u => u.status === "pending").length + profiles.filter(p => p.profileStatus === "pending").length > 0 && (
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
          )}
          <span className="text-[10px] font-sans bg-navy/5 text-navy font-bold px-2 py-1 rounded border border-navy/10">
            {users.filter(u => u.status === "pending").length + profiles.filter(p => p.profileStatus === "pending").length} Pending
          </span>
        </div>
      </section>

      {/* MOBILE HAMBURGER NAVIGATION DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden font-sans">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer layout */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-[300px] bg-white h-full shadow-2xl flex flex-col z-50 transform transition-transform duration-300">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-navy text-white">
              <div className="flex items-center space-x-2">
                <Anchor className="w-5 h-5 text-gold" />
                <span className="font-display font-light text-sm tracking-wide text-white">CBBCL Console Menu</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all"
                id="admin-mobile-drawer-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable menu buttons container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Overview & Queues */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block border-b pb-1">Overview & Queues</span>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab("members"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "members" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span className="flex items-center gap-2"><Users className="w-4 h-4 shrink-0" /> Member Verifications</span>
                    <span className="font-mono text-[9px] bg-slate-100 text-navy px-1.5 py-0.5 rounded font-bold">{users.filter(u => u.status === "pending").length}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("profiles"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "profiles" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span className="flex items-center gap-2"><FileText className="w-4 h-4 shrink-0" /> Profile Approvals</span>
                    <span className="font-mono text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">{profiles.filter(p => p.profileStatus === "pending").length}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("applications"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "applications" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span className="flex items-center gap-2"><Award className="w-4 h-4 text-gold-dark shrink-0" /> Admissions</span>
                    <span className="font-mono text-[9px] bg-amber-50 text-gold-dark px-1.5 py-0.5 rounded font-bold">{applications.filter(a => a.status === "pending" || a.status === "under_verification").length}</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("affiliation_requests"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "affiliation_requests" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" /> Affiliation Requests</span>
                    <span className="font-mono text-[9px] bg-amber-50 text-gold-dark px-1.5 py-0.5 rounded font-bold">{affiliationRequests.filter(r => r.status === "pending").length}</span>
                  </button>
                </div>
              </div>

              {/* Content Management */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block border-b pb-1">Content Management</span>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab("home_cms"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "home_cms" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Layers className="w-4 h-4 text-gold" /> <span>Home Page CMS</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("footer_cms"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "footer_cms" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <FileText className="w-4 h-4 text-gold" /> <span>Dynamic Footer CMS</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("site_content"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "site_content" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <BookOpen className="w-4 h-4" /> <span>Pages Content CMS</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("board"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "board" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <LayoutGrid className="w-4 h-4" /> <span>Board Hierarchy</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("news"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "news" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Megaphone className="w-4 h-4" /> <span>News & Gazette</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("affiliations"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "affiliations" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Anchor className="w-4 h-4" /> <span>Reciprocal Alliances</span>
                  </button>
                </div>
              </div>

              {/* People & Media */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block border-b pb-1">Directory & Libraries</span>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab("club_members"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "club_members" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <UserCheck className="w-4 h-4" /> <span>Club Members</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("media_library"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "media_library" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <ImageIcon className="w-4 h-4" /> <span>Media Library</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("system"); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded ${activeTab === "system" ? "bg-navy text-gold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <HardHat className="w-4 h-4" /> <span>System Diagnostics</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => { setIsMobileMenuOpen(false); handleLogOutAction(); }}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 text-white font-semibold text-xs rounded shadow-xs active:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Console</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Area - Sidebar-driven Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Restructured Navigation Menu divided into sections */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-6">
            
            {/* Group 1: Overview */}
            <div className="space-y-2">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] block border-b border-slate-100 pb-1.5 font-bold">
                Overview & Queues
              </span>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setActiveTab("members")}
                  className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "members" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Users className="w-4 h-4" />
                    <span>Member Verifications</span>
                  </div>
                  <span className="font-mono text-[9px] bg-sky-50 text-navy font-bold px-1.5 py-0.5 rounded">
                    {users.filter(u => u.status === "pending").length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("profiles")}
                  className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "profiles" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Profile Approvals</span>
                  </div>
                  <span className="font-mono text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                    {profiles.filter(p => p.profileStatus === "pending").length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("applications")}
                  className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "applications" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Award className="w-4 h-4 text-gold-dark" />
                    <span>Admissions Nominations</span>
                  </div>
                  <span className="font-mono text-[9px] bg-amber-50 text-gold-dark font-bold px-1.5 py-0.5 rounded">
                    {applications.filter(a => a.status === "pending" || a.status === "under_verification").length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("affiliation_requests")}
                  className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "affiliation_requests" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-gold-dark" />
                    <span>Affiliation Requests</span>
                  </div>
                  <span className="font-mono text-[9px] bg-amber-50 text-gold-dark font-bold px-1.5 py-0.5 rounded">
                    {affiliationRequests.filter(r => r.status === "pending").length}
                  </span>
                </button>
              </div>
            </div>

            {/* Group 2: Content Management */}
            <div className="space-y-2">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] block border-b border-slate-100 pb-1.5 font-bold font-semibold">
                Content Management
              </span>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setActiveTab("home_cms")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "home_cms" ? "bg-navy text-gold font-bold" : "text-[#5c6882] hover:bg-slate-50 hover:text-[#9e7f46]"
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#9e7f46]" />
                  <span className="font-semibold text-slate-800">Home Page Section CMS</span>
                </button>

                <button
                  onClick={() => setActiveTab("footer_cms")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "footer_cms" ? "bg-navy text-gold font-bold" : "text-[#5c6882] hover:bg-slate-50 hover:text-[#9e7f46]"
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#9e7f46]" />
                  <span className="font-semibold text-slate-800">Dynamic Footer CMS</span>
                </button>

                <button
                  onClick={() => setActiveTab("site_content")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "site_content" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Site Pages Content CMS</span>
                </button>

                <button
                  onClick={() => setActiveTab("board")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "board" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Board Hierarchy Staff</span>
                </button>

                <button
                  onClick={() => setActiveTab("news")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "news" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>News & Gazette CMS</span>
                </button>

                <button
                  onClick={() => setActiveTab("affiliations")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "affiliations" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <Anchor className="w-4 h-4" />
                  <span>Reciprocal Alliances</span>
                </button>
              </div>
            </div>

            {/* Group 3: People Management */}
            <div className="space-y-2">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] block border-b border-slate-100 pb-1.5 font-bold">
                People Management
              </span>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setActiveTab("club_members")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "club_members" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Club Members Directory</span>
                </button>
              </div>
            </div>

            {/* Group 4: Media System */}
            <div className="space-y-2">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] block border-b border-slate-100 pb-1.5 font-bold">
                Media System
              </span>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setActiveTab("media_library")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "media_library" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Central Media Library</span>
                </button>
              </div>
            </div>

            {/* Group 5: System */}
            <div className="space-y-2">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#1a2744] block border-b border-slate-100 pb-1.5 font-bold">
                Controls
              </span>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setActiveTab("system")}
                  className={`flex items-center space-x-2.5 w-full text-left px-3.5 py-2.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "system" ? "bg-navy text-gold font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-gold"
                  }`}
                >
                  <HardHat className="w-4 h-4" />
                  <span>System Diagnostics</span>
                </button>
              </div>
            </div>

          </aside>

          {/* RIGHT COLUMN: Active working CMS panels */}
          <main className="lg:col-span-9 space-y-6">
            
            {notification && (
              <div className="p-4 rounded border font-sans text-xs flex items-center space-x-3 bg-[#1a2744]/5 border-gold/30 text-navy shadow-sm animate-fade-in">
                <CheckCircle className="w-5 h-5 text-gold shrink-0" />
                <span>{notification.message}</span>
              </div>
            )}

            {/* RECIPROCAL AFFILIATION REQUESTS TAB */}
            {activeTab === "affiliation_requests" && (
              <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in font-sans">
                <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl text-text-dark font-semibold">Reciprocal Affiliation Requests</h2>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      Assess, verify, and approve clearance credentials and travel introduction cards for members visiting reciprocal clubs.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Request Flow: Manual Scrutiny
                    </span>
                  </div>
                </div>

                {affiliationRequests.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded p-8">
                    <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-sans text-xs text-slate-500 font-light">No Reciprocal Affiliation Access Requests have been filed yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                          <th className="py-3 px-4">Member / ID</th>
                          <th className="py-3 px-4">Selected Club</th>
                          <th className="py-3 px-4">Visit Purpose / Dates</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {affiliationRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 space-y-1">
                              <span className="font-bold text-navy block text-sm">{req.fullName}</span>
                              <div className="flex flex-col space-y-0.5 text-[10px] font-mono text-slate-400">
                                <span>Code: {req.membershipId}</span>
                                <span className="bg-slate-100 text-slate-700 font-sans px-1.5 py-0.5 rounded w-max mt-0.5 uppercase text-[8px] font-bold">
                                  {req.membershipType}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-navy text-[13px]">
                              {req.selectedClub}
                            </td>
                            <td className="py-4 px-4 max-w-xs space-y-1.5">
                              <div className="flex items-center space-x-1.5 text-[10px] text-gold-dark font-semibold">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{req.preferredDates}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-light italic">
                                "{req.purpose}"
                              </p>
                              {req.additionalNotes && (
                                <p className="text-[10px] text-slate-400 leading-normal font-light">
                                  <span className="font-semibold text-slate-500">Note:</span> {req.additionalNotes}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-block text-[9px] font-sans font-extrabold uppercase tracking-wider px-2 py-1 rounded ${
                                req.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : req.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              {req.status === "pending" ? (
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    onClick={() => handleApproveAffiliation(req.id)}
                                    title="Approve & Generate Pass"
                                    className="p-1.5 bg-green-50 text-green-700 hover:bg-green-700 hover:text-white rounded border border-green-200 transition-colors cursor-pointer"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectAffiliation(req.id)}
                                    title="Reject Request"
                                    className="p-1.5 bg-red-50 text-red-700 hover:bg-red-700 hover:text-white rounded border border-red-200 transition-colors cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Resolved</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* MEMBERSHIP NOMINATION APPLICATIONS TAB */}
            {activeTab === "applications" && (
              <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
                <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl text-text-dark font-semibold">Admissions & Nominations Ledger</h2>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      Manage official prestige nominations submitted by prospective members under CBBCL admissions criteria.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="font-sans text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Pending Nominations:
                    </span>
                    <span className="bg-amber-500 text-white rounded-full text-[10px] font-mono px-2 py-0.5 font-bold">
                      {applications.filter((a) => a.status === "pending" || a.status === "under_verification").length}
                    </span>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded text-slate-500 font-sans text-xs">
                    No membership applications are currently recorded on the admissions ledger.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white border border-slate-200 rounded-sm hover:shadow-md transition-all divide-y divide-slate-100 overflow-hidden text-left"
                      >
                        {/* Application Header */}
                        <div className="bg-slate-50/50 px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="inline-block px-2 py-0.5 text-[8px] font-mono rounded font-bold uppercase tracking-wider bg-navy/5 text-navy border border-navy/10 mb-1">
                              {app.membershipType}
                            </span>
                            <h3 className="font-display text-base font-bold text-text-dark">{app.fullName}</h3>
                            <p className="font-sans text-[10px] text-slate-400">
                              Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          {/* Badge Status */}
                          <div>
                            {app.status === "pending" && (
                              <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full">
                                Pending Review
                              </span>
                            )}
                            {app.status === "under_verification" && (
                              <span className="bg-sky-100 text-sky-800 border border-sky-200 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full">
                                Under Verification
                              </span>
                            )}
                            {app.status === "approved" && (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full">
                                Approved Nomination
                              </span>
                            )}
                            {app.status === "rejected" && (
                              <span className="bg-rose-100 text-rose-800 border border-rose-200 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full">
                                Rejected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Application Content */}
                        <div className="p-5 space-y-4 text-xs font-sans">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Candidate Contact Info</span>
                              <p className="text-text-dark font-medium mt-0.5">{app.email}</p>
                              <p className="text-slate-500">{app.phone}</p>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Professional Placement</span>
                              <p className="text-text-dark font-medium mt-0.5">{app.designation}</p>
                              <p className="text-slate-500">{app.organization}</p>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Eligibility Details</span>
                              <p className="text-text-dark font-medium mt-0.5">DOB: {app.dob || "N/A"}</p>
                              <p className="text-slate-500 font-mono text-[10px]">Reference: Verified Channel</p>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-3.5 border border-slate-100 rounded-sm">
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold mb-1">Membership Motivation</span>
                            <p className="text-slate-600 italic leading-relaxed text-[11px]">"{app.motivation}"</p>
                          </div>

                          {app.documentName && (
                            <div className="flex items-center space-x-2 text-slate-500 bg-sky-50/40 p-2 border border-sky-100 rounded-xs w-fit">
                              <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                              <span className="text-[10px] font-mono">{app.documentName}</span>
                              <span className="text-[9px] text-slate-400 font-semibold uppercase shrink-0 bg-white/80 border px-1 rounded">Supporting Document</span>
                            </div>
                          )}
                        </div>

                        {/* Actions Control Panel */}
                        {app.status !== "approved" && app.status !== "rejected" && (
                          <div className="p-4 bg-slate-50 border-t flex flex-wrap gap-2 justify-end">
                            {app.status === "pending" && (
                              <button
                                onClick={() => handleUpdateApplicationStatus(app.id, "under_verification")}
                                className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 font-bold uppercase text-[9px] tracking-wider transition-colors rounded-xs"
                              >
                                Mark Under Verification
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.id, "approved")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 font-bold uppercase text-[9px] tracking-wider transition-colors rounded-xs flex items-center space-x-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-white" />
                              <span>Approve Nomination</span>
                            </button>
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.id, "rejected")}
                              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 font-bold uppercase text-[9px] tracking-wider transition-colors rounded-xs flex items-center space-x-1"
                            >
                              <ShieldX className="w-3.5 h-3.5 text-white" />
                              <span>Reject Nomination</span>
                            </button>
                          </div>
                        )}
                        
                        {app.status === "approved" && (
                          <div className="p-4 bg-emerald-50/50 text-[11px] text-emerald-800 font-sans flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-semibold">This nomination request is formally approved. The candidate profile was inducted automatically with active membership.</span>
                          </div>
                        )}

                        {app.status === "rejected" && (
                          <div className="p-4 bg-rose-50/50 text-[11px] text-rose-800 font-sans flex items-center space-x-2">
                            <ShieldX className="w-4 h-4 text-rose-600 shrink-0" />
                            <span className="font-semibold">This nomination request has been rejected. The decision is logged on the central ledger registry.</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 1. MEMBERS VERIFICATION TAB */}
            {activeTab === "members" && (
              <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
                <div className="border-b pb-4">
                  <h2 className="font-display text-xl text-text-dark font-semibold">CBBCL Registered Members Directory</h2>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Approve newly registered accounts, verify specific structural membership numbers, and monitor roles. 
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold text-[9px] uppercase tracking-wider bg-slate-50">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Membership Number</th>
                        <th className="py-3 px-4">System Role</th>
                        <th className="py-3 px-4 text-right">Verification Status / Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.filter(u => u.role !== "admin").map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-4 font-semibold text-text-dark">{u.name}</td>
                          <td className="py-4 px-4 text-slate-500">{u.email}</td>
                          <td className="py-4 px-4">
                            {editingMembershipNumUser === u.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={tempMembershipNum}
                                  onChange={(e) => setTempMembershipNum(e.target.value)}
                                  className="px-2 py-1 border text-xs outline-none bg-slate-50 focus:bg-white"
                                  placeholder="CBBCL-MEMBER-XXX"
                                />
                                <button
                                  onClick={() => handleVerifyNumber(u.id)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingMembershipNumUser(null)}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-slate-600 font-semibold">{u.membershipNumber || "Not Verified"}</span>
                                <button
                                  onClick={() => {
                                    setEditingMembershipNumUser(u.id);
                                    setTempMembershipNum(u.membershipNumber || "");
                                  }}
                                  className="text-[9px] text-[#c9a84c] underline hover:text-navy"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-navy/5 text-navy px-2 py-0.5 rounded font-bold uppercase text-[9px]">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2.5">
                            {u.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleApproveUser(u.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 font-bold uppercase text-[8px] tracking-wider rounded-xs"
                                >
                                  Verify & Approve
                                </button>
                                <button
                                  onClick={() => handleRejectUser(u.id)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 font-bold uppercase text-[8px] tracking-wider rounded-xs"
                                >
                                  Reject
                                </button>
                              </>
                            ) : u.status === "approved" ? (
                              <span className="text-emerald-600 font-bold uppercase text-[9px] tracking-widest inline-flex items-center space-x-1">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Approved Member</span>
                              </span>
                            ) : (
                              <span className="text-rose-600 font-bold uppercase text-[9px] tracking-widest inline-flex items-center space-x-1">
                                <ShieldX className="w-3.5 h-3.5" />
                                <span>Rejected Account</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. PROFILE APPROVAL QUEUE */}
            {activeTab === "profiles" && (
              <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
                <div className="border-b pb-4">
                  <h2 className="font-display text-xl text-text-dark font-semibold">Digital Profile Review Queue</h2>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Moderate draft publications made by members. Profiles display in public directories only after admin approval.
                  </p>
                </div>

                <div className="space-y-4">
                  {profiles.filter(p => p.profileStatus === "pending").length === 0 ? (
                    <div className="text-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded text-slate-500 font-sans text-xs">
                      There are no pending member profile review requests in the queue.
                    </div>
                  ) : (
                    profiles.filter(p => p.profileStatus === "pending").map((p) => (
                      <div key={p.userId} className="p-5 border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-slate-100 text-[#1a2744] font-bold font-sans uppercase tracking-[0.1em] px-2.5 py-0.5 rounded">
                            {p.membershipType}
                          </span>
                          <h3 className="font-display text-base text-text-dark font-bold">{p.fullName}</h3>
                          <p className="text-xs text-slate-500">Designation: {p.designation} at {p.company}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Registry Serial: {p.membershipNumber}</p>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => setViewingProfile(p)}
                            className="bg-navy text-white px-3.5 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-gold hover:text-navy transition-colors rounded-xs"
                          >
                            Inspect Specs
                          </button>
                          <button
                            onClick={() => handleApproveProfile(p.userId)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-[10px] uppercase font-bold tracking-wider transition-colors rounded-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenRejectProfile(p.userId)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 text-[10px] uppercase font-bold tracking-wider transition-colors rounded-xs"
                          >
                            Return
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. SITE CONTENT CMS TAB (Handles dynamic editing of the entire website text!) */}
            {activeTab === "site_content" && (
              <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b pb-4">
                  <h2 className="font-display text-xl text-text-dark font-semibold">General Landing Pages CMS</h2>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Control texts, hero covers, credentials, welcome dialogs, and official physical addresses live on the public pages.
                  </p>
                </div>

                {/* Sub-tabs Selection Banner */}
                <div className="flex border-b border-slate-200 mb-6 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => setSiteSubTab("pages")}
                    className={`px-4 py-2 border-b-2 font-semibold -mb-[1px] tracking-wider transition-colors ${
                      siteSubTab === "pages" ? "border-gold text-gold font-bold bg-[#1a2744]/5" : "border-transparent text-slate-500 hover:text-navy"
                    }`}
                  >
                    Pages Content CMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteSubTab("navigation")}
                    className={`px-4 py-2 border-b-2 font-semibold -mb-[1px] tracking-wider transition-colors ${
                      siteSubTab === "navigation" ? "border-gold text-gold font-bold bg-[#1a2744]/5" : "border-transparent text-slate-500 hover:text-navy"
                    }`}
                  >
                    Navigation Header CMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSiteSubTab("footer")}
                    className={`px-4 py-2 border-b-2 font-semibold -mb-[1px] tracking-wider transition-colors ${
                      siteSubTab === "footer" ? "border-gold text-gold font-bold bg-[#1a2744]/5" : "border-transparent text-slate-500 hover:text-navy"
                    }`}
                  >
                    Footer & Branding CMS
                  </button>
                </div>

                {siteSubTab === "pages" && (
                  <form onSubmit={handleSavePageSettings} className="space-y-8 text-xs font-sans">
                    {/* Category A: Home Page settings */}
                    <div className="space-y-4">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">Home Page Configuration Banner</span>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Hero Title Text</label>
                        <input
                          type="text"
                          value={siteCms.home.heroTitle}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            home: { ...siteCms.home, heroTitle: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Hero Subtitle Text</label>
                        <textarea
                          value={siteCms.home.heroSubtitle}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            home: { ...siteCms.home, heroSubtitle: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                          rows={2}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <ImageUpload
                          value={siteCms.home.heroCover}
                          onChange={(base64) => setSiteCms({
                            ...siteCms,
                            home: { ...siteCms.home, heroCover: base64 }
                          })}
                          onClear={() => setSiteCms({
                            ...siteCms,
                            home: { ...siteCms.home, heroCover: "" }
                          })}
                          label="Hero Cover / Banner Image"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Metric: Founders</label>
                          <input
                            type="text"
                            value={siteCms.home.metricMembers}
                            onChange={(e) => setSiteCms({
                              ...siteCms,
                              home: { ...siteCms.home, metricMembers: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Metric: Vessels</label>
                          <input
                            type="text"
                            value={siteCms.home.metricVessels}
                            onChange={(e) => setSiteCms({
                              ...siteCms,
                              home: { ...siteCms.home, metricVessels: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">About Title Block</label>
                          <input
                            type="text"
                            value={siteCms.home.aboutSummaryTitle}
                            onChange={(e) => setSiteCms({
                              ...siteCms,
                              home: { ...siteCms.home, aboutSummaryTitle: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs"
                          />
                        </div>
                        <div className="space-y-1 flex items-center pt-5">
                          <label className="flex items-center space-x-2 cursor-pointer font-bold uppercase text-[9px] tracking-wider">
                            <input
                              type="checkbox"
                              checked={siteCms.home.isAboutSummaryActive}
                              onChange={(e) => setSiteCms({
                                ...siteCms,
                                home: { ...siteCms.home, isAboutSummaryActive: e.target.checked }
                              })}
                            />
                            <span>Show About block on Home</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">About Summary Text Block</label>
                        <textarea
                          value={siteCms.home.aboutSummaryText}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            home: { ...siteCms.home, aboutSummaryText: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 text-xs"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Welcome Core Text</label>
                        <textarea
                          value={siteCms.home.welcomeText}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            home: { ...siteCms.home, welcomeText: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 text-xs"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Category B: About Page settings */}
                    <div className="space-y-4 border-t pt-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">About Page Constitution</span>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-bold">Introduction Spec text *</label>
                        <textarea
                          value={siteCms.about.introductionText || siteCms.home.welcomeText}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            about: { ...siteCms.about, introductionText: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-bold">About Our Story Paragraph *</label>
                        <textarea
                          value={siteCms.about.storyText || (siteCms.about as any).storyParagraphs?.join("\n\n")}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            about: { ...siteCms.about, storyText: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-bold">Vision Vision Statement *</label>
                        <textarea
                          value={siteCms.about.visionVision || siteCms.about.visionText}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            about: { ...siteCms.about, visionVision: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                          rows={2}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-bold">Mission Mission Statement *</label>
                        <textarea
                          value={siteCms.about.visionMission || siteCms.about.missionText}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            about: { ...siteCms.about, visionMission: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                          rows={2}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <ImageUpload
                          value={siteCms.about.coverImage}
                          onChange={(base64) => setSiteCms({
                            ...siteCms,
                            about: { ...siteCms.about, coverImage: base64 }
                          })}
                          onClear={() => setSiteCms({
                            ...siteCms,
                            about: { ...siteCms.about, coverImage: "" }
                          })}
                          label="About Cover Header Image"
                        />
                      </div>
                    </div>

                    {/* Category C: Contact page settings */}
                    <div className="space-y-4 border-t pt-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">Contact Office Registry Specifications</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Official Secretarial Email</label>
                          <input
                            type="text"
                            value={siteCms.contact.email}
                            onChange={(e) => setSiteCms({
                              ...siteCms,
                              contact: { ...siteCms.contact, email: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Secretarial Telphone/phone</label>
                          <input
                            type="text"
                            value={siteCms.contact.phone}
                            onChange={(e) => setSiteCms({
                              ...siteCms,
                              contact: { ...siteCms.contact, phone: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Secretarial Building Address</label>
                        <input
                          type="text"
                          value={siteCms.contact.address}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            contact: { ...siteCms.contact, address: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Temporary Outpost Suite Office</label>
                        <input
                          type="text"
                          value={siteCms.contact.temporaryOffice}
                          onChange={(e) => setSiteCms({
                            ...siteCms,
                            contact: { ...siteCms.contact, temporaryOffice: e.target.value }
                          })}
                          className="w-full border p-2 bg-slate-50 text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-8 py-3.5 bg-[#1a2744] hover:bg-gold hover:text-navy text-white text-[11px] font-sans font-bold uppercase tracking-widest transition-all shadow-md block w-full text-center"
                      >
                        Publish Core Dynamic Changes Live
                      </button>
                    </div>
                  </form>
                )}

                {siteSubTab === "navigation" && (
                  <form onSubmit={handleSaveNavSettings} className="space-y-8 text-xs font-sans animate-fade-in">
                    <div className="space-y-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">
                        Branding Logos Specifications
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <ImageUpload
                            value={navCms.logo}
                            onChange={(base64) => setNavCms({ ...navCms, logo: base64 })}
                            onClear={() => setNavCms({ ...navCms, logo: "" })}
                            label="Primary Website Logo (Base64)"
                          />
                        </div>
                        <div className="space-y-1">
                          <ImageUpload
                            value={navCms.navbarLogo}
                            onChange={(base64) => setNavCms({ ...navCms, navbarLogo: base64 })}
                            onClear={() => setNavCms({ ...navCms, navbarLogo: "" })}
                            label="Specific Navbar Logo (Optional Override)"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 border-t pt-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">
                        Menu Structure & Links Manager (Live Tree)
                      </span>

                      <div className="space-y-4">
                        {navCms.menuItems.map((item, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center space-x-2">
                                <span className="bg-navy text-gold font-bold px-2 py-0.5 rounded text-[10px]">
                                  {idx + 1}
                                </span>
                                <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                                <span className="text-slate-400 font-mono text-[10px]">({item.path})</span>
                              </div>

                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  onClick={() => moveMenuItem(idx, "up")}
                                  disabled={idx === 0}
                                  className="p-1 px-2 bg-white hover:bg-slate-100 text-slate-500 border rounded disabled:opacity-30 disabled:hover:bg-white"
                                  title="Move Up"
                                >
                                  ▲
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveMenuItem(idx, "down")}
                                  disabled={idx === navCms.menuItems.length - 1}
                                  className="p-1 px-2 bg-white hover:bg-slate-100 text-slate-500 border rounded disabled:opacity-30 disabled:hover:bg-white"
                                  title="Move Down"
                                >
                                  ▼
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeMenuItem(idx)}
                                  className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded"
                                  title="Remove Link"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 uppercase font-bold">Link Label Text</label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) => updateMenuItemLabel(idx, e.target.value)}
                                  className="w-full border p-1.5 bg-white text-xs"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 uppercase font-bold">Target Page/Path</label>
                                <select
                                  value={item.path}
                                  onChange={(e) => updateMenuItemPath(idx, e.target.value as RoutePath)}
                                  className="w-full border p-1.5 bg-white text-xs"
                                >
                                  {AVAILABLE_ROUTES.map((route) => (
                                    <option key={route.value} value={route.value}>
                                      {route.label} ({route.value})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="bg-white border rounded p-3 space-y-3">
                              <span className="block text-[9px] font-bold text-navy uppercase tracking-wider">
                                Dropdown Sub-navigation links
                              </span>

                              {item.dropdown && item.dropdown.length > 0 ? (
                                <div className="space-y-2">
                                  {item.dropdown.map((drop, dIdx) => (
                                    <div key={dIdx} className="flex items-center justify-between bg-slate-50 p-1.5 px-3 border rounded text-[11px]">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-slate-700">{drop.label}</span>
                                        <span className="text-slate-400 font-mono text-[9px]">
                                          (Scroll Target Anchor: #{drop.sub || "None"})
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeDropdownItem(idx, dIdx)}
                                        className="text-[10px] text-red-500 hover:text-red-700 font-medium"
                                      >
                                        ✕ Remove Sub-link
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-slate-400 text-[10px] italic">No active dropdown items configured.</p>
                              )}

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end border-t pt-2 mt-2">
                                <div className="space-y-1">
                                  <label className="text-[8px] text-slate-400 uppercase font-bold">Sub-Link Label</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. History & Story"
                                    value={newDropLabels[idx] || ""}
                                    onChange={(e) => setNewDropLabels({ ...newDropLabels, [idx]: e.target.value })}
                                    className="w-full border p-1 bg-slate-50 text-[11px]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[8px] text-slate-400 uppercase font-bold">Anchor Name (e.g. history)</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. history"
                                    value={newDropSubs[idx] || ""}
                                    onChange={(e) => setNewDropSubs({ ...newDropSubs, [idx]: e.target.value })}
                                    className="w-full border p-1 bg-slate-50 text-[11px]"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => addDropdownItem(idx)}
                                  className="bg-navy hover:bg-gold hover:text-navy text-white text-[10px] uppercase tracking-wider font-bold p-1.5 transition-all text-center rounded-sm"
                                >
                                  + Join Sub-Link
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-100 border p-4 rounded-sm space-y-3">
                        <span className="block text-xs font-bold text-navy uppercase tracking-wider">
                          Create New Main Header Menu Link
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase font-bold">Header Label Text</label>
                            <input
                              type="text"
                              placeholder="e.g. Virtual Tour"
                              value={newRootLabel}
                              onChange={(e) => setNewRootLabel(e.target.value)}
                              className="w-full border p-2 bg-white text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase font-bold">Target Route Page</label>
                            <select
                              value={newRootPath}
                              onChange={(e) => setNewRootPath(e.target.value as RoutePath)}
                              className="w-full border p-2 bg-white text-xs"
                            >
                              {AVAILABLE_ROUTES.map((route) => (
                                <option key={route.value} value={route.value}>
                                  {route.label} ({route.value})
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={addNewRootMenuItem}
                            className="bg-[#1a2744] hover:bg-gold hover:text-navy text-white font-sans text-xs uppercase tracking-widest font-bold py-2.5 transition-all w-full text-center"
                          >
                            Add Main Link to Tree
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t font-sans">
                      <button
                        type="submit"
                        className="px-8 py-3.5 bg-navy hover:bg-gold hover:text-navy text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-md block w-full text-center"
                      >
                        Publish Navigation Header Live
                      </button>
                    </div>
                  </form>
                )}

                {siteSubTab === "footer" && (
                  <form onSubmit={handleSaveFooterSettings} className="space-y-8 text-xs font-sans animate-fade-in">
                    <div className="space-y-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">
                        Footer Branding & Logos Specifications
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <ImageUpload
                            value={footerCms.logo}
                            onChange={(base64) => setFooterCms({ ...footerCms, logo: base64 })}
                            onClear={() => setFooterCms({ ...footerCms, logo: "" })}
                            label="Footer Official Logo (Base64)"
                          />
                        </div>
                        <div className="space-y-1 pt-4 text-slate-500">
                          <p className="font-light tracking-wide mt-2">
                            Ideal footer logos are transparent PNG representations loaded by standard systems.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Footer Brand Tagline Text
                        </label>
                        <textarea
                          value={footerCms.tagline}
                          onChange={(e) => setFooterCms({ ...footerCms, tagline: e.target.value })}
                          className="w-full border p-2 bg-slate-50 focus:bg-white text-xs text-slate-800"
                          rows={2}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Corporate Description Text
                        </label>
                        <textarea
                          value={footerCms.description}
                          onChange={(e) => setFooterCms({ ...footerCms, description: e.target.value })}
                          className="w-full border p-2 bg-slate-50 focus:bg-white text-xs text-slate-800"
                          rows={2}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-6 border-t pt-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">
                        Secretarial & Contact Registry Information
                      </span>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Official Headquarters Building Address
                        </label>
                        <input
                          type="text"
                          value={footerCms.address}
                          onChange={(e) => setFooterCms({ ...footerCms, address: e.target.value })}
                          className="w-full border p-2 bg-slate-50 text-xs"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Registry Secretarial Email Address
                          </label>
                          <input
                            type="text"
                            value={footerCms.email}
                            onChange={(e) => setFooterCms({ ...footerCms, email: e.target.value })}
                            className="w-full border p-2 bg-slate-50 text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                            Reservation Hotlines & Phones
                          </label>
                          <input
                            type="text"
                            value={footerCms.phone}
                            onChange={(e) => setFooterCms({ ...footerCms, phone: e.target.value })}
                            className="w-full border p-2 bg-slate-50 text-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 border-t pt-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">
                        Branding Copyrights & Social Handles
                      </span>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Legal Copyright License Text
                        </label>
                        <input
                          type="text"
                          value={footerCms.copyright}
                          onChange={(e) => setFooterCms({ ...footerCms, copyright: e.target.value })}
                          className="w-full border p-2 bg-slate-50 text-xs font-light text-slate-700"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">Facebook Page Link</label>
                          <input
                            type="text"
                            value={footerCms.socials?.facebook || ""}
                            onChange={(e) => setFooterCms({
                              ...footerCms,
                              socials: { ...footerCms.socials, facebook: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs text-slate-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">Twitter/X Profile Link</label>
                          <input
                            type="text"
                            value={footerCms.socials?.twitter || ""}
                            onChange={(e) => setFooterCms({
                              ...footerCms,
                              socials: { ...footerCms.socials, twitter: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs text-slate-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">LinkedIn Page Link</label>
                          <input
                            type="text"
                            value={footerCms.socials?.linkedin || ""}
                            onChange={(e) => setFooterCms({
                              ...footerCms,
                              socials: { ...footerCms.socials, linkedin: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs text-slate-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">Instagram Handle Link</label>
                          <input
                            type="text"
                            value={footerCms.socials?.instagram || ""}
                            onChange={(e) => setFooterCms({
                              ...footerCms,
                              socials: { ...footerCms.socials, instagram: e.target.value }
                            })}
                            className="w-full border p-2 bg-slate-50 text-xs text-slate-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 border-t pt-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">
                        Footer Explorable Links & Quick links tree
                      </span>

                      <div className="space-y-2.5">
                        {footerCms.quickLinks.map((ql, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-slate-700">{ql.label}</span>
                              <span className="text-slate-400 font-mono text-[9px]">({ql.path})</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => moveFooterQuickLink(idx, "up")}
                                disabled={idx === 0}
                                className="p-1 px-1.5 bg-white text-slate-500 border rounded disabled:opacity-30"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => moveFooterQuickLink(idx, "down")}
                                disabled={idx === footerCms.quickLinks.length - 1}
                                className="p-1 px-1.5 bg-white text-slate-500 border rounded disabled:opacity-30"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFooterQuickLink(idx)}
                                className="p-1 px-2.5 bg-red-50 text-red-600 hover:bg-red-100 border rounded"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-100 p-4 rounded-sm border space-y-3">
                        <span className="block text-xs font-bold text-navy uppercase tracking-wider">
                          Create New Footer Quick Link
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase font-bold">Link Title Caption</label>
                            <input
                              type="text"
                              placeholder="e.g. Gallery Spot"
                              value={newFooterQLText}
                              onChange={(e) => setNewFooterQLText(e.target.value)}
                              className="w-full border p-2 bg-white text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase font-bold">Target Route Page</label>
                            <select
                              value={newFooterQLPath}
                              onChange={(e) => setNewFooterQLPath(e.target.value as RoutePath)}
                              className="w-full border p-2 bg-white text-xs"
                            >
                              {AVAILABLE_ROUTES.map((route) => (
                                <option key={route.value} value={route.value}>
                                  {route.label} ({route.value})
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={addFooterQuickLink}
                            className="bg-navy hover:bg-gold hover:text-navy text-white text-xs uppercase tracking-widest font-bold py-2.5 transition-all text-center rounded-sm w-full"
                          >
                            Add to Footer
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 border-t pt-6">
                      <span className="block text-xs font-bold text-gold uppercase tracking-wider border-b pb-1">
                        Footer Membership Category Display names
                      </span>

                      <div className="space-y-2">
                        {footerCms.membershipLinks.map((mem_link, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 border rounded text-xs select-none font-sans font-light">
                            <span className="text-slate-700 font-medium">{mem_link}</span>
                            <button
                              type="button"
                              onClick={() => removeFooterMembershipLink(idx)}
                              className="p-1 px-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-100 p-4 rounded-sm border space-y-3">
                        <span className="block text-xs font-bold text-navy uppercase tracking-wider">
                          Create New Membership Category Link Label
                        </span>
                        <div className="flex gap-2 items-end">
                          <div className="space-y-1 flex-1">
                            <label className="text-[9px] text-slate-400 uppercase font-bold">Category Title (with Emoji)</label>
                            <input
                              type="text"
                              placeholder="e.g. 🏢 Corporate Member"
                              value={newFooterMemText}
                              onChange={(e) => setNewFooterMemText(e.target.value)}
                              className="w-full border p-2 bg-white text-xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={addFooterMembershipLink}
                            className="bg-navy hover:bg-gold hover:text-navy text-white text-xs uppercase tracking-widest font-bold py-2.5 px-6 transition-all rounded-sm font-sans"
                          >
                            Add Category Label
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t font-sans">
                      <button
                        type="submit"
                        className="px-8 py-3.5 bg-navy hover:bg-gold hover:text-navy text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-md block w-full text-center"
                      >
                        Publish Footer Branding Live
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 3B. HOME PAGE SECTION CMS TAB */}
            {activeTab === "home_cms" && (
              <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-8 animate-fade-in text-xs font-sans">
                <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="font-display text-xl text-text-dark font-semibold">Home Page CMS & Layout Control</h2>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      Manage dynamic homepage sections, reorder blocks, toggle visibility, and update titles, paragraphs, and high-resolution visuals.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      saveHomeLayoutCMS(homeCms);
                      setNotification({ type: "success", message: "Homepage structure & content successfully published to public portal!" });
                      window.scrollTo(0, 0);
                    }}
                    className="bg-gold hover:bg-[#1a2744] hover:text-white text-navy px-5 py-3 text-[10px] uppercase font-bold tracking-widest cursor-pointer shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Publish Homepage CMS</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  {/* Left Column: Reordering and Toggle Switches */}
                  <div className="xl:col-span-4 bg-slate-50 p-5 border border-slate-200 rounded space-y-5">
                    <h3 className="font-display text-xs text-navy uppercase font-bold tracking-wider border-b border-slate-200 pb-2 flex items-center">
                      <Sliders className="w-3.5 h-3.5 text-gold mr-1.5" />
                      Section Order & Visibility
                    </h3>

                    <div className="space-y-2.5">
                      {homeCms.order.map((sec, idx) => {
                        const secInfo = homeCms.sections[sec as keyof typeof homeCms.sections];
                        const labelMap: Record<string, string> = {
                          hero: "1. Hero Cover Banner",
                          stats: "2. Tallies & Stats Strip",
                          president: "3. President Message Block",
                          overview: "4. Legacy Charter Overview",
                          facilities: "5. Amenities Showcase",
                          events: "6. Upcoming Events Calendar",
                          news: "7. Gazette Media Preview",
                          board: "8. Governance Staff Directory",
                          membership: "9. Membership Class Tiers",
                          affiliations: "10. Reciprocal Alliances",
                          contact: "11. Registry Contact & Map"
                        };

                        const handleMoveUp = () => {
                          if (idx === 0) return;
                          const newOrder = [...homeCms.order];
                          const temp = newOrder[idx];
                          newOrder[idx] = newOrder[idx - 1];
                          newOrder[idx - 1] = temp;
                          setHomeCms({ ...homeCms, order: newOrder });
                        };

                        const handleMoveDown = () => {
                          if (idx === homeCms.order.length - 1) return;
                          const newOrder = [...homeCms.order];
                          const temp = newOrder[idx];
                          newOrder[idx] = newOrder[idx + 1];
                          newOrder[idx + 1] = temp;
                          setHomeCms({ ...homeCms, order: newOrder });
                        };

                        const handleToggleSection = () => {
                          const updatedSections = {
                            ...homeCms.sections,
                            [sec]: {
                              ...secInfo,
                              enabled: !secInfo.enabled
                            }
                          };
                          setHomeCms({ ...homeCms, sections: updatedSections as any });
                        };

                        return (
                          <div
                            key={sec}
                            className={`flex items-center justify-between p-3 border rounded-sm transition-all ${
                              secInfo.enabled 
                                ? "bg-white border-slate-200 shadow-xs" 
                                : "bg-slate-100/70 border-slate-200 opacity-60"
                            }`}
                          >
                            <div className="space-y-1">
                              <span className="font-semibold block font-sans text-[11px] text-slate-800">
                                {labelMap[sec] || sec}
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={handleToggleSection}
                                  className={`px-2 py-0.5 text-[8px] uppercase font-bold tracking-widest rounded-sm ${
                                    secInfo.enabled 
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                                  }`}
                                >
                                  {secInfo.enabled ? "ACTIVE (ON)" : "MUTED (OFF)"}
                                </button>
                                <span className="font-mono text-[9px] text-slate-400">Idx: {idx + 1}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={handleMoveUp}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-navy hover:bg-slate-100 disabled:opacity-30 rounded border"
                                title="Move Block Up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={handleMoveDown}
                                disabled={idx === homeCms.order.length - 1}
                                className="p-1 text-slate-400 hover:text-navy hover:bg-slate-100 disabled:opacity-30 rounded border"
                                title="Move Block Down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3.5 bg-amber-50 border border-amber-200/60 rounded-xs font-sans text-[11px] text-amber-900 space-y-1">
                      <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-800 flex items-center">
                        <Info className="w-3.5 h-3.5 mr-1 text-amber-700" />
                        Dynamic Ordering Rule
                      </span>
                      <p className="font-light leading-relaxed">
                        The public dashboard reads this exact list configuration. Change section placement by clicking Up/Down arrows to design standard landers vs high-engagement setups.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Editing settings for each single block */}
                  <div className="xl:col-span-8 space-y-6">
                    <h3 className="font-display text-xs text-navy uppercase font-bold tracking-wider border-b border-slate-200 pb-2 flex items-center">
                      <Layers className="w-3.5 h-3.5 text-gold mr-1.5" />
                      Section Content Configuration Blocks
                    </h3>

                    <div className="space-y-6">
                      {/* Accordion 1: Hero Cover */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">1. Hero Cover Banner</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Edit main background image, display headlines, subtexts, and redirect CTAs.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Main Headline Text</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.hero.title}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      hero: { ...homeCms.sections.hero, title: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subtitle Text</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.hero.subtitle}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      hero: { ...homeCms.sections.hero, subtitle: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CTA Button 1 Text</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.hero.cta1Text}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      hero: { ...homeCms.sections.hero, cta1Text: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CTA Button 1 Redirect Link</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.hero.cta1Link}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      hero: { ...homeCms.sections.hero, cta1Link: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CTA Button 2 Text</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.hero.cta2Text}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      hero: { ...homeCms.sections.hero, cta2Text: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CTA Button 2 Redirect Link</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.hero.cta2Link}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      hero: { ...homeCms.sections.hero, cta2Link: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2 border-t pt-2 mt-2">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cover Background Visual</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                              <div className="md:col-span-1">
                                <ImageUpload
                                  value={homeCms.sections.hero.image}
                                  onChange={(base64) => {
                                    const savedUrl = syncImageToMediaLibrary(base64, "Dynamic-Hero-Cover");
                                    setMediaLibrary(getMediaLibrary());
                                    setHomeCms({
                                      ...homeCms,
                                      sections: {
                                        ...homeCms.sections,
                                        hero: { ...homeCms.sections.hero, image: savedUrl }
                                      }
                                    });
                                  }}
                                  onClear={() => {
                                    setHomeCms({
                                      ...homeCms,
                                      sections: {
                                        ...homeCms.sections,
                                        hero: { ...homeCms.sections.hero, image: "" }
                                      }
                                    });
                                  }}
                                  label="Cover upload (Auto Sync Media Library)"
                                />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <span className="text-[9px] text-slate-400 uppercase font-semibold block leading-none">Or Select from Existing Media Library:</span>
                                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1.5 border bg-slate-50/50">
                                  {mediaLibrary.map(item => (
                                    <div
                                      key={item.id}
                                      onClick={() => {
                                        setHomeCms({
                                          ...homeCms,
                                          sections: {
                                            ...homeCms.sections,
                                            hero: { ...homeCms.sections.hero, image: item.url }
                                          }
                                        });
                                      }}
                                      className={`h-12 border cursor-pointer relative overflow-hidden group hover:border-gold ${
                                        homeCms.sections.hero.image === item.url ? "border-gold ring-2 ring-gold/20" : "border-slate-200"
                                      }`}
                                    >
                                      <img src={item.url} className="w-full h-full object-cover" alt="preview selection" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 2: Stats Strip */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">2. Tallies & Stats Strip</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Edit figures and descriptive labels displayed in the quick horizontal strip.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1 border-r pr-2">
                              <label className="text-[10px] text-slate-400 font-semibold block">Tally 1 (Members Number)</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.stats.metricMembers}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      stats: { ...homeCms.sections.stats, metricMembers: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold block">Tally 1 Label</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.stats.labelMembers}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      stats: { ...homeCms.sections.stats, labelMembers: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>

                            <div className="space-y-1 border-r pr-2">
                              <label className="text-[10px] text-slate-400 font-semibold block">Tally 2 (Vessels Number)</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.stats.metricVessels}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      stats: { ...homeCms.sections.stats, metricVessels: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold block">Tally 2 Label</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.stats.labelVessels}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      stats: { ...homeCms.sections.stats, labelVessels: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
                            <div className="space-y-1 border-r pr-2">
                              <label className="text-[10px] text-slate-400 font-semibold block">Tally 3 (Tonnage/Berths)</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.stats.metricTonnage}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      stats: { ...homeCms.sections.stats, metricTonnage: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold block">Tally 3 Label</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.stats.labelTonnage}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      stats: { ...homeCms.sections.stats, labelTonnage: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>

                            <div className="space-y-1 border-r pr-2">
                              <label className="text-[10px] text-slate-400 font-semibold block">Tally 4 (Events Number)</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.stats.metricEvents}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      stats: { ...homeCms.sections.stats, metricEvents: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-semibold block">Tally 4 Label</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.stats.labelEvents}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      stats: { ...homeCms.sections.stats, labelEvents: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 3: President Message */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">3. President Message Block</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Edit photo, official full name, designation title, and message body contents.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block">Official Name</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.president.name}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      president: { ...homeCms.sections.president, name: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block">Designation Title</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.president.designation}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      president: { ...homeCms.sections.president, designation: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">Paragraph 1 of message</label>
                            <textarea
                              rows={3}
                              className="w-full border p-2 text-xs leading-relaxed text-slate-700 font-sans"
                              value={homeCms.sections.president.bio[0] || ""}
                              onChange={(e) => {
                                const newBio = [...homeCms.sections.president.bio];
                                newBio[0] = e.target.value;
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    president: { ...homeCms.sections.president, bio: newBio }
                                  }
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">Paragraph 2 of message</label>
                            <textarea
                              rows={3}
                              className="w-full border p-2 text-xs leading-relaxed text-slate-700 font-sans"
                              value={homeCms.sections.president.bio[1] || ""}
                              onChange={(e) => {
                                const newBio = [...homeCms.sections.president.bio];
                                newBio[1] = e.target.value;
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    president: { ...homeCms.sections.president, bio: newBio }
                                  }
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-2 border-t pt-2 mt-2">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">President Portrait Photo</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                              <div className="md:col-span-1">
                                <ImageUpload
                                  value={homeCms.sections.president.image}
                                  onChange={(base64) => {
                                    const savedUrl = syncImageToMediaLibrary(base64, "President-Portrait");
                                    setMediaLibrary(getMediaLibrary());
                                    setHomeCms({
                                      ...homeCms,
                                      sections: {
                                        ...homeCms.sections,
                                        president: { ...homeCms.sections.president, image: savedUrl }
                                      }
                                    });
                                  }}
                                  onClear={() => {
                                    setHomeCms({
                                      ...homeCms,
                                      sections: {
                                        ...homeCms.sections,
                                        president: { ...homeCms.sections.president, image: "" }
                                      }
                                    });
                                  }}
                                  label="Upload Portrait"
                                />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                <span className="text-[9px] text-slate-400 font-semibold block uppercase">Or Pick from Active Media Store:</span>
                                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1.5 border bg-slate-50/50 flex">
                                  {mediaLibrary.map(item => (
                                    <div
                                      key={item.id}
                                      onClick={() => {
                                        setHomeCms({
                                          ...homeCms,
                                          sections: {
                                            ...homeCms.sections,
                                            president: { ...homeCms.sections.president, image: item.url }
                                          }
                                        });
                                      }}
                                      className={`h-12 border cursor-pointer relative overflow-hidden hover:border-gold ${
                                        homeCms.sections.president.image === item.url ? "border-gold ring-2 ring-gold/20" : "border-slate-200"
                                      }`}
                                    >
                                      <img src={item.url} className="w-full h-full object-cover" alt="prev selection" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 4: Club Overview */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">4. Legacy Charter Overview</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Control layout rotation alignment, official descriptions, and double image galleries.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block">Title Text</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.overview.title}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      overview: { ...homeCms.sections.overview, title: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block">Subtitle Accent</label>
                              <input
                                type="text"
                                className="w-full border p-2"
                                value={homeCms.sections.overview.subtitle}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      overview: { ...homeCms.sections.overview, subtitle: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">Layout Alignment Mode</label>
                            <select
                              className="w-full border p-2 bg-white"
                              value={homeCms.sections.overview.layout}
                              onChange={(e) => {
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    overview: { ...homeCms.sections.overview, layout: e.target.value as any }
                                  }
                                });
                              }}
                            >
                              <option value="standard">Standard (Images Left, Text Right)</option>
                              <option value="reversed">Reversed (Text Left, Images Right)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">Description Body A</label>
                            <textarea
                              rows={3}
                              className="w-full border p-2 text-xs leading-relaxed"
                              value={homeCms.sections.overview.text}
                              onChange={(e) => {
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    overview: { ...homeCms.sections.overview, text: e.target.value }
                                  }
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">Welcome Description Body B</label>
                            <textarea
                              rows={3}
                              className="w-full border p-2 text-xs leading-relaxed"
                              value={homeCms.sections.overview.welcomeText}
                              onChange={(e) => {
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    overview: { ...homeCms.sections.overview, welcomeText: e.target.value }
                                  }
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-3 border-t pt-2 mt-2">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Double Gallery Overlap Placement Visuals</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-3 border space-y-2 bg-slate-50/50">
                                <span className="font-semibold block text-[10px] text-slate-700">Primary Large Image</span>
                                <div className="grid grid-cols-1 gap-2">
                                  <ImageUpload
                                    value={homeCms.sections.overview.gallery[0] || ""}
                                    onChange={(base64) => {
                                      const savedUrl = syncImageToMediaLibrary(base64, "Overview-Gallery-1");
                                      setMediaLibrary(getMediaLibrary());
                                      const newGallery = [...homeCms.sections.overview.gallery];
                                      newGallery[0] = savedUrl;
                                      setHomeCms({
                                        ...homeCms,
                                        sections: {
                                          ...homeCms.sections,
                                          overview: { ...homeCms.sections.overview, gallery: newGallery }
                                        }
                                      });
                                    }}
                                    onClear={() => {
                                      const newGallery = [...homeCms.sections.overview.gallery];
                                      newGallery[0] = "";
                                      setHomeCms({
                                        ...homeCms,
                                        sections: {
                                          ...homeCms.sections,
                                          overview: { ...homeCms.sections.overview, gallery: newGallery }
                                        }
                                      });
                                    }}
                                    label="Upload Banner Grid 1"
                                  />
                                </div>
                              </div>

                              <div className="p-3 border space-y-2 bg-slate-50/50 border-emerald-50">
                                <span className="font-semibold block text-[10px] text-slate-700">Secondary Overlapping Image</span>
                                <div className="grid grid-cols-1 gap-2">
                                  <ImageUpload
                                    value={homeCms.sections.overview.gallery[1] || ""}
                                    onChange={(base64) => {
                                      const savedUrl = syncImageToMediaLibrary(base64, "Overview-Gallery-2");
                                      setMediaLibrary(getMediaLibrary());
                                      const newGallery = [...homeCms.sections.overview.gallery];
                                      newGallery[1] = savedUrl;
                                      setHomeCms({
                                        ...homeCms,
                                        sections: {
                                          ...homeCms.sections,
                                          overview: { ...homeCms.sections.overview, gallery: newGallery }
                                        }
                                      });
                                    }}
                                    onClear={() => {
                                      const newGallery = [...homeCms.sections.overview.gallery];
                                      newGallery[1] = "";
                                      setHomeCms({
                                        ...homeCms,
                                        sections: {
                                          ...homeCms.sections,
                                          overview: { ...homeCms.sections.overview, gallery: newGallery }
                                        }
                                      });
                                    }}
                                    label="Upload Overlay Grid 2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 5: Facilities Showcase */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">5. Amenities Showcase</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5 font-sans">Control layout threshold metrics, showcased amount blocks, etc.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">Max Showcase Amount Limit</label>
                            <input
                              type="number"
                              className="w-full border p-2 font-mono text-xs"
                              min={1}
                              max={12}
                              value={homeCms.sections.facilities.limit}
                              onChange={(e) => {
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    facilities: { ...homeCms.sections.facilities, limit: parseInt(e.target.value) || 6 }
                                  }
                                });
                              }}
                            />
                            <span className="text-[10px] text-slate-400 font-light leading-none">How many facility cards display on the live homepage grid (ordered chronologically by creation date).</span>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 6: Events Calendar */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">6. Upcoming Events Calendar</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Edit density bounds & showcase capacities for the live dynamic calendar strip.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">Showcase Tally Limit</label>
                            <input
                              type="number"
                              className="w-full border p-2 font-mono text-xs"
                              min={1}
                              max={9}
                              value={homeCms.sections.events.limit}
                              onChange={(e) => {
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    events: { ...homeCms.sections.events, limit: parseInt(e.target.value) || 3 }
                                  }
                                });
                              }}
                            />
                            <span className="text-[10px] text-slate-400 font-light leading-none">Determine the maximum number of upcoming events of interests featured horizontally.</span>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 7: News Gazette Preview */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">7. Gazette Media Preview</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Control post filters, category limitations, and maximum card counts.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block">Featured Cards Count</label>
                              <input
                                type="number"
                                className="w-full border p-2 font-mono"
                                min={1}
                                max={12}
                                value={homeCms.sections.news.limit}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      news: { ...homeCms.sections.news, limit: parseInt(e.target.value) || 3 }
                                    }
                                  });
                                }}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block">Category Stream Filter</label>
                              <select
                                className="w-full border p-2 bg-white"
                                value={homeCms.sections.news.categoryFilter}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      news: { ...homeCms.sections.news, categoryFilter: e.target.value }
                                    }
                                  });
                                }}
                              >
                                <option value="All">All Categories (Manned Feed)</option>
                                <option value="Notice">Notice Only</option>
                                <option value="Press Releases">Press Releases Only</option>
                                <option value="Sports">Sports Announcements</option>
                                <option value="Achievements">Achievements & Diplomas</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 8: Board Highlight Strip */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">8. Governance Staff Directory</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Feature and order direct profiles of directors live on home banners.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Featured Founding Board Selections</span>
                            <span className="text-[10px] text-slate-400 block pb-1.5 font-light">Choose which Directors' short bio profiles appear highlighted on the leadership tree. Click checkboxes to feature:</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {boardMembers.map((member) => {
                                const isSelected = (homeCms.sections.board.featuredIds || []).includes(member.id);
                                const handleToggleFeature = () => {
                                  let currentList = [...(homeCms.sections.board.featuredIds || [])];
                                  if (isSelected) {
                                    currentList = currentList.filter(id => id !== member.id);
                                  } else {
                                    currentList.push(member.id);
                                  }
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      board: { ...homeCms.sections.board, featuredIds: currentList }
                                    }
                                  });
                                };

                                return (
                                  <div
                                    key={member.id}
                                    onClick={handleToggleFeature}
                                    className={`p-2.5 border rounded-xs cursor-pointer flex items-center justify-between transition-colors ${
                                      isSelected ? "bg-amber-50/60 border-gold" : "bg-white border-slate-200 hover:border-slate-300"
                                    }`}
                                  >
                                    <div className="space-y-0.5">
                                      <span className="font-semibold block text-[11px] text-slate-800">{member.name}</span>
                                      <span className="text-[9px] text-[#c9a84c] tracking-widest uppercase">{member.designation}</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      isSelected ? "bg-gold border-gold text-navy" : "bg-white border-slate-300"
                                    }`}>
                                      {isSelected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 9: Membership Privilege Preview */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">9. Membership Class Tiers</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Highlight premium categories, mute unwanted modules, and control public options.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 col-span-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Highlight Target Category</label>
                              <select
                                className="w-full border p-2 bg-white"
                                value={homeCms.sections.membership.highlightCategory}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      membership: { ...homeCms.sections.membership, highlightCategory: e.target.value }
                                    }
                                  });
                                }}
                              >
                                <option value="Life Membership">Life Membership (Legacy Anchor)</option>
                                <option value="Donor Membership">Donor Membership</option>
                                <option value="Permanent Membership">Permanent Membership</option>
                                <option value="Associate Membership">Associate Membership</option>
                                <option value="Diplomat Membership">Diplomat Membership</option>
                                <option value="Foreign Membership">Foreign Membership</option>
                                <option value="Corporate Membership flex">Corporate Membership</option>
                                <option value="Honorary Membership">Honorary Membership</option>
                              </select>
                              <span className="text-[10px] text-slate-400 font-light block">The highlighted category represents standard entries glowing with a gold border outline.</span>
                            </div>

                            <div className="space-y-1 col-span-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Muted Categories (Hide Cards)</label>
                              <span className="text-[10px] text-slate-400 block font-light pb-1">Exclude categories you don't want to show on the public main deck currently:</span>
                              
                              <div className="grid grid-cols-1 gap-1 border p-2 bg-slate-50/50 max-h-32 overflow-y-auto">
                                {[
                                  "Donor Membership",
                                  "Life Membership",
                                  "Permanent Membership",
                                  "Associate Membership",
                                  "Diplomat Membership",
                                  "Foreign Membership",
                                  "Corporate Membership",
                                  "Honorary Membership"
                                ].map((cat) => {
                                  const isMuted = (homeCms.sections.membership.hiddenCategories || []).includes(cat);
                                  const handleToggleMute = () => {
                                    let list = [...(homeCms.sections.membership.hiddenCategories || [])];
                                    if (isMuted) {
                                      list = list.filter(c => c !== cat);
                                    } else {
                                      list.push(cat);
                                    }
                                    setHomeCms({
                                      ...homeCms,
                                      sections: {
                                        ...homeCms.sections,
                                        membership: { ...homeCms.sections.membership, hiddenCategories: list }
                                      }
                                    });
                                  };

                                  return (
                                    <label key={cat} className="flex items-center space-x-2 text-[10px] py-0.5 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={isMuted}
                                        onChange={handleToggleMute}
                                        className="rounded border-slate-300 text-gold focus:ring-gold"
                                      />
                                      <span className={isMuted ? "text-rose-600 line-through" : "text-slate-700 font-sans"}>{cat}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 10: Reciprocal Alliances */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">10. Reciprocal Alliances</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Highlight premium partnerships like EZBOOKING with special brand outline filters.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Highlight Featured Alliances</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {affiliations.map((aff) => {
                                const isFeatured = (homeCms.sections.affiliations.featuredIds || []).includes(aff.id);
                                const handleToggleFeatured = () => {
                                  let list = [...(homeCms.sections.affiliations.featuredIds || [])];
                                  if (isFeatured) {
                                    list = list.filter(id => id !== aff.id);
                                  } else {
                                    list.push(aff.id);
                                  }
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      affiliations: { ...homeCms.sections.affiliations, featuredIds: list }
                                    }
                                  });
                                };

                                return (
                                  <div
                                    key={aff.id}
                                    onClick={handleToggleFeatured}
                                    className={`p-2 border rounded-xs cursor-pointer text-center hover:border-gold transition-colors block ${
                                      isFeatured ? "bg-amber-50/50 border-gold ring-1 ring-gold/20" : "bg-white border-slate-200"
                                    }`}
                                  >
                                    <span className="font-semibold block text-[10px] truncate text-slate-800">{aff.name}</span>
                                    <span className="text-[8px] text-slate-400 uppercase tracking-tighter block mt-0.5">{aff.partnershipType}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accordion 11: Registry Contact & Map */}
                      <div className="border border-slate-200 rounded-sm">
                        <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-display font-semibold text-slate-800 text-sm">11. Registry Contact & Map</span>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">Edit official address credentials, helpline hotlines, emails, and active forms toggle.</p>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-sans">Official Headquarters Address</label>
                            <input
                              type="text"
                              className="w-full border p-2"
                              value={homeCms.sections.contact.address}
                              onChange={(e) => {
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    contact: { ...homeCms.sections.contact, address: e.target.value }
                                  }
                                });
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Enquiry Phone Hotline</label>
                              <input
                                type="text"
                                className="w-full border p-2 font-mono"
                                value={homeCms.sections.contact.phone}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      contact: { ...homeCms.sections.contact, phone: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Registry Email Host</label>
                              <input
                                type="text"
                                className="w-full border p-2 font-mono"
                                value={homeCms.sections.contact.email}
                                onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      contact: { ...homeCms.sections.contact, email: e.target.value }
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider font-sans">VIP Temporary Office Location</label>
                            <input
                              type="text"
                              className="w-full border p-2 font-sans"
                              value={homeCms.sections.contact.temporaryOffice}
                              onChange={(e) => {
                                  setHomeCms({
                                    ...homeCms,
                                    sections: {
                                      ...homeCms.sections,
                                      contact: { ...homeCms.sections.contact, temporaryOffice: e.target.value }
                                    }
                                  });
                              }}
                            />
                          </div>

                          <div className="p-3 border rounded bg-slate-50 flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="font-semibold block text-[11px] text-slate-800">Inquiry Proposal Contact Form Enabled</span>
                              <span className="text-[9px] text-slate-400 font-sans">Controls whether the public can file digital proposal letters on the map segment.</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setHomeCms({
                                  ...homeCms,
                                  sections: {
                                    ...homeCms.sections,
                                    contact: { ...homeCms.sections.contact, formEnabled: !homeCms.sections.contact.formEnabled }
                                  }
                                });
                              }}
                              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded border cursor-pointer ${
                                homeCms.sections.contact.formEnabled 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  : "bg-rose-50 text-rose-700 border-rose-300"
                              }`}
                            >
                              {homeCms.sections.contact.formEnabled ? "FORM ACTIVE" : "FORM DISABLED"}
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. BOARD HIERARCHY MANAGER */}
            {activeTab === "board" && (
              <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
                <div className="border-b pb-4 flex justify-between items-center gap-4 flex-wrap">
                  <div>
                    <h2 className="font-display text-xl text-text-dark font-semibold">Board of Directors Hierarchy Layout</h2>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      Drag-and-drop cards across governance rows. Row placement controls public displaying layout sequentially from President down.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenBoardModal()}
                    className="bg-navy hover:bg-gold text-white hover:text-navy px-4 py-2 font-bold uppercase tracking-wider text-[9px] flex items-center space-x-1 transition-colors rounded-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Compile New Director Spec</span>
                  </button>
                </div>

                {/* Lanes Grid */}
                <div className="space-y-8 font-sans">
                  {[
                    { level: 1, name: "Row I: Ultimate Presidency Circle (Founding President)" },
                    { level: 2, name: "Row II: Vice Presidency Team" },
                    { level: 3, name: "Row III: Standing Secretariat Organizers" },
                    { level: 4, name: "Row IV: Governing Board Circle members" }
                  ].map((lane) => {
                    const rowDirectors = boardMembers
                      .filter((d) => (d.level ?? 4) === lane.level)
                      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

                    return (
                      <div
                        key={lane.level}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDropOnLane(lane.level)}
                        className={`p-5 rounded border ${
                          draggedId ? "bg-slate-50 border-dashed border-gold/40" : "bg-bg-secondary border-slate-200"
                        } transition-colors space-y-4`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-display text-xs text-[#1a2744] font-bold uppercase tracking-wider">{lane.name}</h3>
                          <span className="font-mono text-[9px] bg-sky-50 text-navy font-bold px-2 py-0.5 rounded">
                            {rowDirectors.length} spec(s)
                          </span>
                        </div>

                        {rowDirectors.length === 0 ? (
                          <div className="p-8 text-center border border-dashed border-slate-300 text-slate-450 text-[10px] uppercase font-mono tracking-wide">
                            Drag or move cards here to assign to this ranking.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {rowDirectors.map((d) => (
                              <div
                                key={d.id}
                                draggable
                                onDragStart={() => handleDragStart(d.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDropOnCard(e, d.id, lane.level)}
                                className="bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group relative rounded-xs transition-shadow"
                              >
                                {draggedId && draggedId !== d.id && (
                                  <div className="absolute inset-x-0 -top-2 h-4 bg-gold/15 border-t border-dashed border-gold pointer-events-none"></div>
                                )}

                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-50 border overflow-hidden shrink-0">
                                    <img
                                      src={d.photoUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100"}
                                      className="w-full h-full object-cover"
                                      alt="p"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="font-display text-xs text-text-dark font-bold truncate">{d.name}</h4>
                                    <p className="text-[10px] text-gold font-medium truncate mt-0.5">{d.designation}</p>
                                    <p className="text-[8px] text-slate-400 font-mono mt-0.5">{d.appointed}</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3.5">
                                  <div className="flex space-x-1.5">
                                    <button
                                      onClick={() => handleQuickMove(d.id, "up")}
                                      className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                                      title="Shift Display Priority Up"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleQuickMove(d.id, "down")}
                                      className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                                      title="Shift Display Priority Down"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleOpenBoardModal(d)}
                                      className="p-1 hover:bg-indigo-50 text-indigo-600 rounded"
                                      title="Edit Attributes"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteBoardItem(d.id)}
                                      className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                                      title="Remove from board"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. NEWS FEED CMS */}
            {activeTab === "news" && (
              <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
                <div className="border-b pb-4 flex justify-between items-center gap-4 flex-wrap">
                  <div>
                    <h2 className="font-display text-xl text-text-dark font-semibold">The Ocean Gazette Press CMS</h2>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      Draft news bulletins, press notifications, water sports results, and general publications.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenNewsModal()}
                    className="bg-navy hover:bg-gold text-white hover:text-navy px-4 py-2 font-bold uppercase tracking-wider text-[9px] flex items-center space-x-1 transition-colors rounded-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dispatch New Bulletin</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  {newsPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-5 border border-slate-200 hover:border-gold rounded-xs flex flex-col justify-between space-y-4 bg-bg-primary"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-gold uppercase font-bold">{post.category}</span>
                          <span className="text-slate-400 font-mono">{post.date}</span>
                        </div>
                        <h3 className="font-display text-sm text-text-dark font-semibold leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        {post.image && (
                          <div className="h-16 w-full rounded overflow-hidden bg-slate-50 border">
                            <img src={post.image} className="w-full h-full object-cover" alt="prev" />
                          </div>
                        )}
                        <p className="text-[11px] text-text-body font-light line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t pt-3 border-slate-200/50">
                        <div className="flex space-x-2 text-[9px] text-slate-400 font-mono">
                          <span>Likes: {post.likes}</span>
                          <span>·</span>
                          <span>Comms: {post.commentsCount}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenNewsModal(post)}
                            className="p-1 px-2 hover:bg-navy hover:text-white text-navy border text-[9px] font-bold uppercase tracking-wide rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNewsPost(post.id)}
                            className="p-1 px-2 hover:bg-rose-600 hover:text-white text-rose-600 border text-[9px] font-bold uppercase tracking-wide rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PARTNER AFFILIATIONS */}
            {activeTab === "affiliations" && (
              <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
                <div className="border-b pb-4 flex justify-between items-center gap-4 flex-wrap">
                  <div>
                    <h2 className="font-display text-xl text-text-dark font-semibold">Alliance Partners CMS</h2>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      Manage global yacht organizations, city guest houses, and reciprocal clubs connected to the CBBCL passport.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenAffModal()}
                    className="bg-navy hover:bg-gold text-white hover:text-navy px-4 py-2 font-bold uppercase tracking-wider text-[9px] flex items-center space-x-1 transition-colors rounded-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Include New Partner</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  {affiliations.map((aff) => (
                    <div
                      key={aff.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded flex space-x-4 items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 bg-white rounded border overflow-hidden flex items-center justify-center shrink-0 p-1">
                          <img
                            src={aff.logo || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=105"}
                            className="w-full h-full object-contain"
                            alt="logo"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display text-xs text-text-dark font-semibold truncate">{aff.name}</h4>
                          <span className="text-[10px] text-gold font-bold uppercase block">{aff.partnershipType}</span>
                          <span className="text-[8px] text-slate-400 block">{aff.country || "Bangladesh"}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 shrink-0">
                        <button
                          onClick={() => handleOpenAffModal(aff)}
                          className="bg-navy hover:bg-gold text-white hover:text-navy p-1.5 text-[9px] rounded uppercase font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAffiliation(aff.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 text-[9px] rounded uppercase font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. CLUB MEMBERS DIRECTORY CMS */}
            {activeTab === "club_members" && (() => {
              const adminFilteredMembers = clubMembers
                .filter((member) => {
                  // Search
                  const searchLower = adminMemberSearch.toLowerCase();
                  const matchesSearch =
                    member.name.toLowerCase().includes(searchLower) ||
                    member.membershipCode.toLowerCase().includes(searchLower) ||
                    (member.email && member.email.toLowerCase().includes(searchLower)) ||
                    (member.bio && member.bio.toLowerCase().includes(searchLower));

                  // Category Filter
                  const catToMatch = member.category || "General Member";
                  const matchesCategory =
                    adminMemberCategoryFilter === "All" || catToMatch === adminMemberCategoryFilter;

                  return matchesSearch && matchesCategory;
                })
                .sort((a, b) => {
                  if (adminMemberSortBy === "name") {
                    return a.name.localeCompare(b.name);
                  }
                  if (adminMemberSortBy === "category") {
                    const catA = a.category || "General Member";
                    const catB = b.category || "General Member";
                    return catA.localeCompare(catB);
                  }
                  if (adminMemberSortBy === "code") {
                    return a.membershipCode.localeCompare(b.membershipCode);
                  }
                  if (adminMemberSortBy === "joinDate") {
                    return b.joinDate.localeCompare(a.joinDate);
                  }
                  return 0;
                });

              return (
                <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
                  <div className="border-b pb-4 flex justify-between items-center gap-4 flex-wrap">
                    <div>
                      <h2 className="font-display text-xl text-text-dark font-semibold">Club Members Directory CMS</h2>
                      <p className="text-xs text-slate-500 font-light mt-1">
                        Explicitly register official club citizens, generate distinct membership identification keys, and write biographical profiles.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenClubMemberModal()}
                      className="bg-navy hover:bg-gold text-white hover:text-navy px-4 py-2 font-bold uppercase tracking-wider text-[9px] flex items-center space-x-1 transition-colors rounded-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Register New Member Code</span>
                    </button>
                  </div>

                  {/* Search, Filter & Sort Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-200">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#1a2744] block uppercase font-bold">Search Members</label>
                      <input
                        type="text"
                        value={adminMemberSearch}
                        onChange={(e) => setAdminMemberSearch(e.target.value)}
                        placeholder="Search name, code, email..."
                        className="w-full border p-2 bg-white text-xs text-text-dark focus:border-navy outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[#1a2744] block uppercase font-bold">Filter By Institutional Category</label>
                      <select
                        value={adminMemberCategoryFilter}
                        onChange={(e) => setAdminMemberCategoryFilter(e.target.value)}
                        className="w-full border p-2 bg-white text-xs text-text-dark font-medium outline-none"
                      >
                        <option value="All">All Categories</option>
                        <option value="Founding Member">Founding Member</option>
                        <option value="Executive Officer">Executive Officer</option>
                        <option value="General Member">General Member</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[#1a2744] block uppercase font-bold">Sort Listings By</label>
                      <select
                        value={adminMemberSortBy}
                        onChange={(e) => setAdminMemberSortBy(e.target.value as any)}
                        className="w-full border p-2 bg-white text-xs text-text-dark font-medium outline-none"
                      >
                        <option value="name">Alpha Sort (Name)</option>
                        <option value="category">Institutional Category</option>
                        <option value="code">Membership Unique Code</option>
                        <option value="joinDate">Join Date (Newest First)</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto text-xs font-sans">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-205 text-slate-400 font-bold text-[9px] uppercase tracking-wider bg-slate-50">
                          <th className="py-2.5 px-3">Avatar</th>
                          <th className="py-2.5 px-3">Member Name</th>
                          <th className="py-2.5 px-3">Registry Code</th>
                          <th className="py-2.5 px-3">Category Class</th>
                          <th className="py-2.5 px-3 text-[#1a2744]">Institutional Category</th>
                          <th className="py-2.5 px-3">Enrolled Join Date</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminFilteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-slate-400 font-light">
                              No matching member records found under specified filter criteria.
                            </td>
                          </tr>
                        ) : (
                          adminFilteredMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50/50">
                              <td className="py-3 px-3">
                                <div className="w-8 h-8 rounded-full border overflow-hidden bg-slate-100">
                                  <img
                                    src={member.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"}
                                    className="w-full h-full object-cover"
                                    alt="u"
                                  />
                                </div>
                              </td>
                              <td className="py-3 px-3 font-semibold text-[#1a2744]">{member.name}</td>
                              <td className="py-3 px-3 font-mono text-slate-500 font-bold">{member.membershipCode}</td>
                              <td className="py-3 px-3 text-slate-700">{member.membershipType}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-widest ${
                                  member.category === "Founding Member" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                                  member.category === "Executive Officer" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                                  "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}>
                                  {member.category || "General Member"}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-400">{member.joinDate}</td>
                              <td className="py-3 px-3">
                                <select
                                  value={member.status}
                                  onChange={(e) => handleToggleMemberStatus(member.id, e.target.value as any)}
                                  className={`text-[9px] uppercase font-bold outline-none border rounded px-1.5 py-0.5 ${
                                    member.status === "Active" ? "bg-emerald-50 text-emerald-800 border-emerald-300" :
                                    member.status === "Pending" ? "bg-amber-50 text-amber-800 border-amber-300" :
                                    "bg-rose-50 text-rose-800 border-rose-300"
                                  }`}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Suspended">Suspended</option>
                                </select>
                              </td>
                              <td className="py-3 px-3 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenClubMemberModal(member)}
                                  className="text-navy hover:text-gold font-bold uppercase text-[9px] border px-2 py-1"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClubMember(member.id)}
                                  className="text-rose-600 hover:text-rose-800 font-bold uppercase text-[9px] border border-rose-100 px-2 py-1"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* 8. CENTRAL MEDIA LIBRARY */}
            {activeTab === "media_library" && (
              <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b pb-4">
                  <h2 className="font-display text-xl text-text-dark font-semibold">Central Media Library Storage</h2>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Upload icons, logos, cover banners, or portraits. This repository stores images as Base64 Data URLs so they display perfectly without requesting third party URLs.
                  </p>
                </div>

                {/* Upload Image segment to central library */}
                <div className="p-5 bg-slate-50 border rounded space-y-4 font-sans text-xs">
                  <h3 className="font-display text-xs text-navy uppercase font-bold tracking-wider">Add Image to Media Store</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-semibold">Image Title Name</label>
                        <input
                          type="text"
                          value={tempMediaName}
                          onChange={(e) => setTempMediaName(e.target.value)}
                          placeholder="e.g., Lounge Sunset View"
                          className="w-full border p-2.5 bg-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase font-semibold">Categorization Class</label>
                        <select
                          value={tempMediaCat}
                          onChange={(e) => setTempMediaCat(e.target.value as any)}
                          className="w-full border p-2.5 bg-white outline-none"
                        >
                          <option value="Gallery">Gallery Photos</option>
                          <option value="News Images">News & Press Banner</option>
                          <option value="Board Photos">Board Portrait</option>
                          <option value="Logos">Alliance Brand Logo</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddNewMediaItem}
                        className="bg-navy hover:bg-gold text-white hover:text-navy px-4 py-2.5 font-bold uppercase tracking-wider text-[10px] w-full block text-center"
                      >
                        Commit to Central Library
                      </button>
                    </div>

                    <div>
                      <ImageUpload
                        value={tempMediaFile}
                        onChange={(base64) => setTempMediaFile(base64)}
                        onClear={() => setTempMediaFile("")}
                        label="Upload Asset File"
                      />
                    </div>
                  </div>
                </div>

                {/* Display grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans pt-4">
                  {mediaLibrary.map((m) => (
                    <div
                      key={m.id}
                      className="border border-slate-200 bg-slate-50/30 p-2.5 rounded-sm flex flex-col justify-between space-y-3 group hover:border-gold transition-colors"
                    >
                      <div className="h-32 w-full overflow-hidden border bg-white flex items-center justify-center relative">
                        <img src={m.url} className="h-full w-full object-cover" alt="prev" />
                        <span className="absolute top-2 left-2 text-[8px] uppercase bg-navy text-gold font-bold px-1.5 py-0.5 rounded">
                          {m.category}
                        </span>
                      </div>
                      <div className="min-w-0 text-center">
                        <h4 className="text-xs text-slate-800 font-semibold truncate">{m.name}</h4>
                        <p className="text-[9px] text-slate-400 mt-1 truncate">
                          Size: {Math.round((m.url.length * 3) / 4 / 1024)} KB
                        </p>
                      </div>

                      <div className="flex space-x-1.5 border-t pt-2.5">
                        <button
                          type="button"
                          onClick={() => handleCopyBase64(m.url)}
                          className="flex-1 bg-slate-200 hover:bg-navy hover:text-white transition-colors text-slate-700 text-[9px] font-bold py-1 px-1 rounded flex items-center justify-center space-x-1 uppercase"
                          title="Copy Base64 string to clipboard"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Raw</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMediaItem(m.id)}
                          className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors text-[9px] font-bold p-1 rounded"
                          title="Permanently remove asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {mediaLibrary.length === 0 && (
                    <div className="col-span-4 text-center py-10 font-mono text-slate-400 uppercase text-xs">
                      No media files inside repository. Go ahead and drag-upload files above!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 9. SYSTEM DIAGNOSTICS */}
            {activeTab === "system" && (
              <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b pb-4">
                  <h2 className="font-display text-xl text-text-dark font-semibold">System Diagnostics & Indicators</h2>
                  <p className="text-xs text-slate-500 font-light mt-1">
                    Overview of the core local storage registries, dimensions, and operational properties.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
                  <div className="p-4 bg-slate-50 border rounded space-y-1">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">Registry status</span>
                    <span className="text-sm text-emerald-600 font-bold block flex items-center space-x-1">
                      <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
                      <span>OPERATIONAL</span>
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded space-y-1 font-mono">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-sans font-bold">Storage footprint</span>
                    <span className="text-xs text-slate-700 font-bold block">
                      {Math.round(JSON.stringify(localStorage).length / 1024)} KB / 5120 KB
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border rounded space-y-1">
                    <span className="text-[9px] text-[#c9a84c] block uppercase tracking-wider font-bold">System build target</span>
                    <span className="text-xs text-navy font-bold block font-mono">
                      VITE SPA + CMS CORES
                    </span>
                  </div>
                </div>

                <div className="space-y-4 font-sans text-xs border-t pt-6">
                  <h3 className="font-display text-sm font-semibold text-text-dark">Quick Stats & Tallies</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 border rounded bg-slate-50/50">
                      <span className="text-[10px] text-slate-400 block">System Users</span>
                      <span className="text-lg font-bold text-navy select-none">{users.length}</span>
                    </div>
                    <div className="p-3 border rounded bg-slate-50/50">
                      <span className="text-[10px] text-slate-400 block">Registered Members</span>
                      <span className="text-lg font-bold text-navy select-none">{clubMembers.length}</span>
                    </div>
                    <div className="p-3 border rounded bg-slate-50/50">
                      <span className="text-[10px] text-slate-400 block">Board Members</span>
                      <span className="text-lg font-bold text-navy select-none">{boardMembers.length}</span>
                    </div>
                    <div className="p-3 border rounded bg-slate-50/50">
                      <span className="text-[10px] text-slate-400 block">Gazette Postings</span>
                      <span className="text-lg font-bold text-navy select-none">{newsPosts.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER CMS PANEL */}
            {activeTab === "footer_cms" && (
              <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-8 animate-fade-in font-sans">
                <div className="border-b pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl text-text-dark font-semibold">Dynamic Footer Settings CMS</h2>
                    <p className="text-xs text-slate-500 font-light mt-1">
                      Manage links, contact information, social handles, legal policies, and general copyright parameters served live across the entire website footer.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetFooterToDefault}
                    className="text-[10px] text-slate-500 hover:text-navy border px-2.5 py-1 uppercase tracking-wider font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Reset to Defaults
                  </button>
                </div>

                {/* BRAND LOGO CONSOLE */}
                <div className="space-y-4 border-b pb-6">
                  <h3 className="text-sm font-semibold text-navy uppercase tracking-wider border-l-2 border-gold pl-2">Dynamic Website Brand Logo</h3>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-sm grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-6">
                    {/* Upload / Interactive Container */}
                    <div className="space-y-3">
                      <label className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Dynamic Logo File Selector (PNG, SVG, or JPG)</label>
                      <div className="relative border border-dashed border-slate-200 bg-white p-5 rounded hover:border-gold hover:bg-gold/5 transition-all text-center flex flex-col items-center justify-center cursor-pointer min-h-[140px] group">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            // Max 2MB size check
                            if (file.size > 2 * 1024 * 1024) {
                              triggerNotice("error", "The uploaded brand logo asset exceeds the 2MB size limit. Please compress it or upload a smaller PNG/SVG.");
                              return;
                            }

                            const fd = new FormData();
                            fd.append("image", file);

                            try {
                              const adminUser = getLoggedInUser();
                              const res = await fetch("/api/upload", {
                                method: "POST",
                                headers: {
                                  "X-User-Role": adminUser?.role || "admin"
                                },
                                body: fd
                              });
                              if (!res.ok) {
                                const errStr = await res.json();
                                throw new Error(errStr.error || "Upload failed.");
                              }
                              const uploadData = await res.json();
                              if (uploadData && uploadData.url) {
                                setFooterSettings({
                                  ...footerSettings,
                                  logo: {
                                    type: "image",
                                    url: uploadData.url,
                                    alt: footerSettings.logo?.alt || "Cox's Bazar Boat Club Logo"
                                  }
                                });
                                triggerNotice("success", "Dynamic Brand Logo file successfully saved and uploaded to server storage!");
                              }
                            } catch (err: any) {
                              console.warn("Backend dynamic asset upload failed, carrying out safe offline Base64 compression callback...");
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  // Compress image to JPEG to stay within localStorage boundaries
                                  const img = new Image();
                                  img.src = reader.result;
                                  img.onload = () => {
                                    const canvas = document.createElement("canvas");
                                    const MAX_WIDTH = 500;
                                    const MAX_HEIGHT = 500;
                                    let width = img.width;
                                    let height = img.height;
                                    if (width > height) {
                                      if (width > MAX_WIDTH) {
                                        height *= MAX_WIDTH / width;
                                        width = MAX_WIDTH;
                                      }
                                    } else {
                                      if (height > MAX_HEIGHT) {
                                        width *= MAX_HEIGHT / height;
                                        height = MAX_HEIGHT;
                                      }
                                    }
                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext("2d");
                                    if (ctx) {
                                      ctx.drawImage(img, 0, 0, width, height);
                                      const compressed = canvas.toDataURL("image/jpeg", 0.7);
                                      setFooterSettings({
                                        ...footerSettings,
                                        logo: {
                                          type: "image",
                                          url: compressed,
                                          alt: footerSettings.logo?.alt || "Cox's Bazar Boat Club Logo"
                                        }
                                      });
                                      triggerNotice("success", "Brand Logo updated offline via high-compression storage stream!");
                                    }
                                  };
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div className="p-2.5 bg-slate-50 rounded-full group-hover:bg-white text-slate-400 group-hover:text-[#9e7f46] shadow-sm mb-2 transition-all">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-[11px] font-bold text-text-dark font-sans group-hover:text-[#9e7f46] transition-colors">
                          Click or drag dynamic brand asset to upload
                        </p>
                        <p className="text-[9px] text-slate-400 font-sans tracking-wide mt-1">
                          PNG (preferred), SVG, or JPG. Max Limit: 2MB.
                        </p>
                      </div>

                      {/* Manual / Alternate input field */}
                      <div className="pt-2 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Explicit Logo Image URL (OR embed link)</label>
                        <input
                          type="text"
                          value={footerSettings.logo?.url || ""}
                          onChange={(e) => setFooterSettings({
                            ...footerSettings,
                            logo: {
                              type: "image",
                              url: e.target.value,
                              alt: footerSettings.logo?.alt || "Cox's Bazar Boat Club Logo"
                            }
                          })}
                          className="w-full text-xs font-sans p-2 border rounded-sm focus:ring-1 focus:ring-gold focus:outline-hidden"
                          placeholder="e.g. /uploads/logo-12345.png or external link..."
                        />
                      </div>
                    </div>

                    {/* Preview Area & Options */}
                    <div className="border border-slate-100 bg-white p-4 rounded flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Logo Preview</h4>
                          {footerSettings.logo?.url && (
                            <button
                              type="button"
                              onClick={() => setFooterSettings({
                                ...footerSettings,
                                logo: {
                                  type: "image",
                                  url: "",
                                  alt: "Site Logo"
                                }
                              })}
                              className="text-[9px] text-rose-500 hover:text-rose-700 font-bold uppercase tracking-widest cursor-pointer"
                            >
                              Reset to Vector
                            </button>
                          )}
                        </div>

                        {/* Real-time Renderer Box */}
                        <div className="bg-[#111625] h-[130px] rounded-xs border border-white/[0.08] flex items-center justify-center relative overflow-hidden p-4 select-none">
                          {footerSettings.logo?.url ? (
                            <img
                              src={footerSettings.logo.url}
                              alt={footerSettings.logo.alt || "Logo Logo"}
                              className="max-h-[100px] max-w-full object-contain block"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="text-center text-slate-400 space-y-1">
                              <p className="text-[10px] font-bold text-gold uppercase tracking-widest">FALLING BACK TO VECTOR</p>
                              <p className="text-[9px] font-light text-slate-500"> Cox's Bazar Boat Club Emblem </p>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-400 font-light mt-2 leading-relaxed">
                          {footerSettings.logo?.url ? "Logo is currently reading from custom upload path. It will display rendered against a dark theme gradient across the live site." : "Using elegant fallback vector. When empty or inactive, the site serves the default embedded marine insignia circle emblem."}
                        </div>
                      </div>

                      {/* Custom ALT & Ratio Crop controls */}
                      <div className="pt-4 grid grid-cols-1 gap-2 border-t border-slate-100 mt-2">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Logo ALT Accessibility Tag (SEO Alt text)</label>
                          <input
                            type="text"
                            value={footerSettings.logo?.alt || ""}
                            onChange={(e) => setFooterSettings({
                              ...footerSettings,
                              logo: {
                                type: "image",
                                url: footerSettings.logo?.url || "",
                                alt: e.target.value
                              }
                            })}
                            className="w-full text-xs font-sans p-2 border rounded-sm focus:ring-1 focus:ring-gold"
                            placeholder="Alt description for search engines..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SOCIAL MEDIA SECTION */}
                <div className="space-y-4 border-b pb-6">
                  <h3 className="text-sm font-semibold text-navy uppercase tracking-wider border-l-2 border-gold pl-2">Social Media Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Facebook URL</label>
                      <input
                        type="text"
                        value={footerSettings.socialLinks.facebook}
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          socialLinks: { ...footerSettings.socialLinks, facebook: e.target.value }
                        })}
                        className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Instagram URL</label>
                      <input
                        type="text"
                        value={footerSettings.socialLinks.instagram}
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          socialLinks: { ...footerSettings.socialLinks, instagram: e.target.value }
                        })}
                        className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Linkedin URL</label>
                      <input
                        type="text"
                        value={footerSettings.socialLinks.linkedin}
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          socialLinks: { ...footerSettings.socialLinks, linkedin: e.target.value }
                        })}
                        className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Twitter/X URL</label>
                      <input
                        type="text"
                        value={footerSettings.socialLinks.twitter}
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          socialLinks: { ...footerSettings.socialLinks, twitter: e.target.value }
                        })}
                        className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">YouTube URL</label>
                      <input
                        type="text"
                        value={footerSettings.socialLinks.youtube || ""}
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          socialLinks: { ...footerSettings.socialLinks, youtube: e.target.value }
                        })}
                        className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                        placeholder="https://youtube.com/c/..."
                      />
                    </div>
                  </div>
                </div>

                {/* CONTACT SECTION */}
                <div className="space-y-4 border-b pb-6">
                  <h3 className="text-sm font-semibold text-navy uppercase tracking-wider border-l-2 border-gold pl-2">Contact & Registries</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Registry Desk Email (Valid format required)</label>
                      <input
                        type="text"
                        value={footerSettings.contact.email}
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          contact: { ...footerSettings.contact, email: e.target.value }
                        })}
                        className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                        placeholder="registry@cbbcl.org"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Registry Phone / Hotline</label>
                      <input
                        type="text"
                        value={footerSettings.contact.phone}
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          contact: { ...footerSettings.contact, phone: e.target.value }
                        })}
                        className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                        placeholder="+880 1711-223344"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Club Secretariat Address (Office Headquarters)</label>
                      <textarea
                        value={footerSettings.contact.address}
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          contact: { ...footerSettings.contact, address: e.target.value }
                        })}
                        rows={3}
                        className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                        placeholder="Coastal Point Bypass, Marine Drive Boulevard, Cox's Bazar, Bangladesh"
                      />
                    </div>
                  </div>
                </div>

                {/* FOOTER LINKS EDITOR */}
                <div className="space-y-4 border-b pb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-navy uppercase tracking-wider border-l-2 border-gold pl-2">Footer Column Link Categories</h3>
                    <button
                      type="button"
                      onClick={handleAddFooterLinkGroup}
                      className="cursor-pointer text-[10px] bg-[#9e7f46] hover:bg-[#866a3a] text-white font-semibold px-2.5 py-1.5 uppercase tracking-wider flex items-center shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Category Column
                    </button>
                  </div>

                  <div className="space-y-6">
                    {footerSettings.footerLinks.map((group, groupIdx) => (
                      <div key={groupIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-sm relative space-y-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveFooterLinkGroup(groupIdx)}
                          className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="Remove Column Category Group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="max-w-md space-y-1">
                          <label className="text-[9px] text-[#9e7f46] font-bold uppercase block">Column Title</label>
                          <input
                            type="text"
                            value={group.title}
                            onChange={(e) => handleUpdateGroupTitle(groupIdx, e.target.value)}
                            className="text-xs p-2.5 border rounded bg-white font-bold w-full focus:ring-1 focus:ring-gold focus:outline-hidden"
                            placeholder="e.g. Navigation Base"
                          />
                        </div>

                        {/* Repeatable links inside group */}
                        <div className="space-y-2 pt-2">
                          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wide border-b border-slate-100 pb-1">Column Links</div>
                          {group.links.map((link, linkIdx) => (
                            <div key={linkIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={link.name}
                                onChange={(e) => handleUpdateGroupLink(groupIdx, linkIdx, "name", e.target.value)}
                                className="flex-1 text-xs p-2 border rounded bg-white focus:ring-1 focus:ring-gold"
                                placeholder="Link Label (e.g. About Our Story)"
                              />
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => handleUpdateGroupLink(groupIdx, linkIdx, "url", e.target.value)}
                                className="flex-1 text-xs p-2 border rounded bg-white font-mono focus:ring-1 focus:ring-gold"
                                placeholder="URL Route (e.g. /about.html)"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveGroupLink(groupIdx, linkIdx)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddGroupLink(groupIdx)}
                            className="text-[10px] text-navy hover:text-gold-dark font-semibold flex items-center space-x-1 pt-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 mr-0.5 inline text-[#9e7f46]" /> Add Link Item
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LEGAL LINKS SECTION */}
                <div className="space-y-4 border-b pb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-navy uppercase tracking-wider border-l-2 border-gold pl-2">Legal Disclaimers & Policies</h3>
                    <button
                      type="button"
                      onClick={handleAddLegalLink}
                      className="cursor-pointer text-[10px] bg-[#9e7f46] hover:bg-[#866a3a] text-white font-semibold px-2.5 py-1.5 uppercase tracking-wider flex items-center shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Policy Link
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-3">
                    {footerSettings.legalLinks.map((legal, legalIdx) => (
                      <div key={legalIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={legal.name}
                          onChange={(e) => handleUpdateLegalLink(legalIdx, "name", e.target.value)}
                          className="flex-1 text-xs p-2 border rounded bg-white focus:ring-1 focus:ring-gold"
                          placeholder="Policy Page Name (e.g. Privacy Policy)"
                        />
                        <input
                          type="text"
                          value={legal.url}
                          onChange={(e) => handleUpdateLegalLink(legalIdx, "url", e.target.value)}
                          className="flex-1 text-xs p-2 border rounded bg-white font-mono focus:ring-1 focus:ring-gold"
                          placeholder="URL Route (e.g. /about.html)"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveLegalLink(legalIdx)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {footerSettings.legalLinks.length === 0 && (
                      <div className="text-xs text-slate-400 font-light text-center py-2">No legal policies defined.</div>
                    )}
                  </div>
                </div>

                {/* COPYRIGHT COLUMN */}
                <div className="space-y-4 border-b pb-6">
                  <h3 className="text-sm font-semibold text-navy uppercase tracking-wider border-l-2 border-gold pl-2">Copyright Disclaimer Statement</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Copyright Text</label>
                    <input
                      type="text"
                      value={footerSettings.copyright}
                      onChange={(e) => setFooterSettings({ ...footerSettings, copyright: e.target.value })}
                      className="w-full text-xs font-sans p-2.5 border rounded-xs focus:ring-1 focus:ring-gold focus:outline-hidden"
                      placeholder="© 2026 Cox's Bazar Boat Club Limited. All Rights Reserved."
                    />
                  </div>
                </div>

                {/* SAVE ACTION */}
                <div className="flex items-center justify-end pt-4 bg-slate-50 -mx-6 -mb-6 p-6 border-t border-slate-100 gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const adminUser = getLoggedInUser();
                        const updated = await updateFooterSettings(footerSettings, adminUser?.role);
                        setFooterSettings(updated);
                        // Raise local state update broadcast event
                        window.dispatchEvent(new Event("cbbcl-footer-updated"));
                        triggerNotice("success", "Dynamic Footer parameters updated and deployed successfully to persistent site_settings database!");
                      } catch (err: any) {
                        triggerNotice("error", "Validation error: " + err.message);
                      }
                    }}
                    className="cursor-pointer bg-[#9e7f46] hover:bg-[#866a3a] text-white font-semibold text-xs px-6 py-2.5 rounded-sm transition-all shadow border border-[#9e7f46] uppercase tracking-wider"
                  >
                    Save & Standardize Footer
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </section>

      {/* MODALS SEGMENTS */}

      {/* A. VIEW/INSPECT SPECS PROFILE MODAL */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-6 backdrop-blur-xs select-none">
          <div className="bg-white w-full max-w-2xl border border-gold/40 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingProfile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-navy p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg text-text-dark font-semibold border-b pb-3 mb-4">
              Detailed Professional Member Spec Check
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 text-xs font-sans">
              <div className="sm:col-span-4 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border overflow-hidden bg-slate-50 mb-3 relative flex items-center justify-center">
                  {viewingProfile.photoUrl ? (
                    <img src={viewingProfile.photoUrl} className="w-full h-full object-cover" alt="portrait" />
                  ) : (
                    <span className="font-mono text-slate-400 text-[10px]">No Photo</span>
                  )}
                </div>
                <span className="font-mono text-[9px] font-bold bg-navy text-gold px-2.5 py-0.5 rounded">
                  {viewingProfile.membershipNumber}
                </span>
              </div>

              <div className="sm:col-span-8 space-y-3.5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">FULL NAME</span>
                    <span className="text-slate-800 font-semibold">{viewingProfile.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">CLASS CATEGORY</span>
                    <span className="text-slate-800">{viewingProfile.membershipType}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">BUSINESS / ENTITY ROLE</span>
                    <span className="text-slate-800 font-semibold">{viewingProfile.designation}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">COMPANY</span>
                    <span className="text-slate-800">{viewingProfile.company}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">LinkedIn Profiles</span>
                  <span className="text-navy">{viewingProfile.linkedInUrl || "Not Specified"}</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Professional Biography</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    "{viewingProfile.bio || "No summary written by member."}"
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-6 flex justify-end space-x-2">
              <button
                onClick={() => handleApproveProfile(viewingProfile.userId)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-xs"
              >
                Approve & Publish Specs
              </button>
              <button
                onClick={() => handleOpenRejectProfile(viewingProfile.userId)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-xs"
              >
                Reject & Give Revision Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. CONFIRM REJECTION COMMENT SPEC MODAL */}
      {rejectingProfileId && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-6 backdrop-blur-xs select-none">
          <div className="bg-white w-full max-w-md border shadow-2xl p-6 relative">
            <h3 className="font-display text-base text-text-dark font-semibold mb-3">
              Explain Rejection / Revision Notes
            </h3>
            <textarea
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              className="w-full border p-2 text-xs font-sans outline-none bg-slate-50 focus:bg-white"
              rows={4}
              placeholder="Provide detailed feedback on what needs to be changed (e.g., Please use an appropriate official portrait)..."
              required
            ></textarea>
            <div className="flex justify-end space-x-2 mt-4 text-xs">
              <button
                onClick={() => setRejectingProfileId(null)}
                className="bg-slate-100 hover:bg-slate-200 px-3.5 py-2 font-bold uppercase text-[10px] tracking-wider rounded-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmProfileRejection}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 font-bold uppercase text-[10px] tracking-wider rounded-xs"
              >
                Submit Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. BOARD MEMBER SPEC EDIT MODAL */}
      {isBoardModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-6 backdrop-blur-xs select-none">
          <div className="bg-white w-full max-w-2xl border border-gold shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsBoardModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg text-text-dark font-semibold border-b pb-3 mb-6">
              {editingBoardItem ? "Edit Director Specifications Specs" : "Add Director to Founding Board Specs"}
            </h3>

            <form onSubmit={handleSaveBoardItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={boardForm.name}
                    onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                    placeholder="e.g. Humayun Kabir Robel"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Club Designation *</label>
                  <input
                    type="text"
                    required
                    value={boardForm.designation}
                    onChange={(e) => setBoardForm({ ...boardForm, designation: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                    placeholder="e.g. Founding President"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Membership Serial Code *</label>
                  <input
                    type="text"
                    required
                    value={boardForm.membershipCode}
                    onChange={(e) => setBoardForm({ ...boardForm, membershipCode: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs font-mono"
                    placeholder="e.g. CBBCL-FOUNDER-001"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Appointed Date String</label>
                  <input
                    type="text"
                    value={boardForm.appointed}
                    onChange={(e) => setBoardForm({ ...boardForm, appointed: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                    placeholder="e.g. January 2026"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <ImageUpload
                    value={boardForm.photoUrl}
                    onChange={(base64) => setBoardForm({ ...boardForm, photoUrl: base64 })}
                    onClear={() => setBoardForm({ ...boardForm, photoUrl: "" })}
                    label="Portrait Photo"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Biographical Introduction</label>
                  <textarea
                    value={boardForm.bio}
                    onChange={(e) => setBoardForm({ ...boardForm, bio: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                    rows={3}
                    placeholder="Write a small description... (Separated by new lines for paragraphs)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Principal Company</label>
                  <input
                    type="text"
                    value={boardForm.company}
                    onChange={(e) => setBoardForm({ ...boardForm, company: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                    placeholder="e.g. Summit Group / S. Alam Group"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Role inside Company</label>
                  <input
                    type="text"
                    value={boardForm.role}
                    onChange={(e) => setBoardForm({ ...boardForm, role: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs border"
                    placeholder="e.g. Managing Director / Chairman"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Corporate Industry Sector</label>
                  <input
                    type="text"
                    value={boardForm.industry}
                    onChange={(e) => setBoardForm({ ...boardForm, industry: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs border"
                    placeholder="e.g., Shipping, Power, Textile"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-semibold">Business Achievements (Comma Separated)</label>
                  <input
                    type="text"
                    value={boardForm.achievements}
                    onChange={(e) => setBoardForm({ ...boardForm, achievements: e.target.value })}
                    className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                    placeholder="e.g., CIP Status, Forbes Regional Winner"
                  />
                </div>
              </div>

              {/* Hierarchy Position Selection Configuration */}
              <div className="border-t pt-4 space-y-4 font-sans text-xs">
                <span className="block text-[10px] font-bold text-[#c9a84c] uppercase tracking-wider">Board Hierarchy Position Controls</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase block font-semibold">Hierarchy Row Level *</label>
                    <select
                      value={boardForm.level}
                      onChange={(e) => setBoardForm({ ...boardForm, level: Number(e.target.value) })}
                      className="w-full border p-2 bg-slate-50 focus:bg-white text-xs outline-none"
                    >
                      <option value={1}>Row I: High Presidency (President)</option>
                      <option value={2}>Row II: Vice Presidency (Vice President)</option>
                      <option value={3}>Row III: Core Secretariat Directors</option>
                      <option value={4}>Row IV: Governing Founding Board Circle members</option>
                    </select>
                  </div>

                  {!editingBoardItem && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase block font-semibold">Card Placement Sequence</label>
                      <select
                        value={boardForm.placement}
                        onChange={(e) => setBoardForm({ ...boardForm, placement: e.target.value })}
                        className="w-full border p-2 bg-slate-50 focus:bg-white text-xs outline-none"
                      >
                        <option value="bottom">Append to Bottom as Last Element</option>
                        <option value="top">Insert on Beginning as Top Element</option>
                      </select>
                    </div>
                  )}

                  {editingBoardItem && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase block font-semibold">Manual Order Index Sequence</label>
                      <input
                        type="number"
                        value={boardForm.orderIndex}
                        onChange={(e) => setBoardForm({ ...boardForm, orderIndex: Number(e.target.value) })}
                        className="w-full border p-2 bg-slate-50 focus:bg-white text-xs"
                        min={0}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBoardModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 px-5 py-2.5 font-bold uppercase text-[9px] tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-navy hover:bg-gold text-white hover:text-navy px-5 py-2.5 font-bold uppercase tracking-wider text-[9px] transition-colors"
                >
                  Apply & Publish Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. NEWS / BULLETIN PUBLISH MODAL */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-6 backdrop-blur-xs select-none">
          <div className="bg-white w-full max-w-3xl border shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsNewsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg text-text-dark font-semibold border-b pb-3 mb-6">
              {editingNewsItem ? "Edit Gazette Release" : "Publish New Ocean Gazette Bulletin"}
            </h3>

            <form onSubmit={handleSaveNewsPost} className="space-y-4">
              <div className="space-y-4 font-sans text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 block uppercase font-bold">Release Title Text *</label>
                  <input
                    type="text"
                    required
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none"
                    placeholder="e.g. Construction of Permanent Clubhouse Pier reaches 80% mark"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-455 block uppercase font-bold">Category Scope *</label>
                    <select
                      value={newsForm.category}
                      onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as any })}
                      className="w-full border p-2.5 bg-slate-50 outline-none"
                    >
                      <option value="News">News</option>
                      <option value="Announcements">Announcements</option>
                      <option value="Governance">Governance</option>
                      <option value="CSR">CSR</option>
                      <option value="Sports">Sports</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-455 block uppercase font-gold font-bold">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={newsForm.tags}
                      onChange={(e) => setNewsForm({ ...newsForm, tags: e.target.value })}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none"
                      placeholder="e.g. Jetty, Construction, Yacht"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-455 block uppercase font-bold">Publishing Status *</label>
                    <select
                      value={newsForm.status}
                      onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value as any })}
                      className="w-full border p-2.5 bg-slate-50 outline-none"
                    >
                      <option value="Published">Published (Public)</option>
                      <option value="Draft">Draft (Internal Only)</option>
                      <option value="Scheduled">Scheduled (Auto release)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-455 block uppercase font-bold">
                      Scheduled Release Date
                    </label>
                    <input
                      type="date"
                      value={newsForm.scheduledDate}
                      onChange={(e) => setNewsForm({ ...newsForm, scheduledDate: e.target.value })}
                      disabled={newsForm.status !== "Scheduled"}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none disabled:opacity-35"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <ImageUpload
                    value={newsForm.image}
                    onChange={(base64) => setNewsForm({ ...newsForm, image: base64 })}
                    onClear={() => setNewsForm({ ...newsForm, image: "" })}
                    label="Cover Banner Image"
                  />
                  <div className="mt-2 space-y-1">
                    <label className="text-[10px] text-[#9e7f46] block uppercase font-bold">Or Raw Image URL / Raw Embed Code (Canva, YouTube, SVG, iframe HTML)</label>
                    <textarea
                      value={newsForm.image}
                      onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                      className="w-full border p-2 bg-slate-50 focus:bg-white text-[11px] font-mono outline-none"
                      rows={3}
                      placeholder='Paste raw link (e.g. https://...) or complete embed code (e.g. <iframe ...></iframe>, <div style="...">...</div>)'
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-455 block uppercase font-bold">Short Excerpt Summary *</label>
                  <input
                    type="text"
                    required
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                    className="w-full border p-2.5 bg-slate-50 focus:bg-white"
                    placeholder="Write a catchy 1-sentence synopsis of the news release..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-455 block uppercase font-bold">Full Press Content Markdown *</label>
                  <textarea
                    required
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    className="w-full border p-2.5 focus:bg-white font-mono text-xs"
                    rows={10}
                    placeholder="Write the full press release of the news dynamic bulletin. Markdown format supported."
                  />
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-[9px] uppercase font-bold tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-navy hover:bg-gold text-white hover:text-navy px-5 py-2.5 text-[9px] uppercase font-bold tracking-widest transition-colors"
                >
                  Apply & Publish Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E. AFFILIATE ORGANIZATIONS MODAL */}
      {isAffModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-6 backdrop-blur-xs select-none">
          <div className="bg-white w-full max-w-lg border shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAffModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg text-text-dark font-semibold border-b pb-3 mb-6">
              {editingAffItem ? "Edit Alliance specs" : "Anchor New Reciprocal Alliance"}
            </h3>

            <form onSubmit={handleSaveAffiliation} className="space-y-4">
              <div className="space-y-4 font-sans text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 block uppercase font-bold">Alliance Partner Name *</label>
                  <input
                    type="text"
                    required
                    value={affForm.name}
                    onChange={(e) => setAffForm({ ...affForm, name: e.target.value })}
                    className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none"
                    placeholder="e.g. Royal Bengal Yachting Club"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 block uppercase font-bold">Partnership Alliance Type *</label>
                    <input
                      type="text"
                      required
                      value={affForm.partnershipType}
                      onChange={(e) => setAffForm({ ...affForm, partnershipType: e.target.value })}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none"
                      placeholder="e.g., Reciprocal Club / Guest Lodge"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-455 block uppercase font-bold">Alliance Country</label>
                    <input
                      type="text"
                      value={affForm.country}
                      onChange={(e) => setAffForm({ ...affForm, country: e.target.value })}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none"
                      placeholder="e.g., United Kingdom / Bangladesh"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-455 block uppercase font-bold font-bold">Partner Website URL</label>
                  <input
                    type="text"
                    value={affForm.website}
                    onChange={(e) => setAffForm({ ...affForm, website: e.target.value })}
                    className="w-full border p-2.5 bg-slate-50 focus:bg-white"
                    placeholder="e.g., https://royalbengalyc.com"
                  />
                </div>

                <div className="space-y-1">
                  <ImageUpload
                    value={affForm.logoUrl}
                    onChange={(base64) => setAffForm({ ...affForm, logoUrl: base64 })}
                    onClear={() => setAffForm({ ...affForm, logoUrl: "" })}
                    label="Partner Organization Logo"
                  />
                  <div className="mt-2 space-y-1">
                    <label className="text-[10px] text-[#9e7f46] block uppercase font-bold">Or Raw Image URL / Raw Embed Code (Canva, YouTube, SVG, iframe HTML)</label>
                    <textarea
                      value={affForm.logoUrl}
                      onChange={(e) => setAffForm({ ...affForm, logoUrl: e.target.value })}
                      className="w-full border p-2 bg-slate-50 focus:bg-white text-[11px] font-mono outline-none"
                      rows={3}
                      placeholder='Paste raw link (e.g. https://...) or complete embed code (e.g. <iframe ...></iframe>, <div style="...">...</div>)'
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAffModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-[9px] uppercase font-bold tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-navy hover:bg-gold text-white hover:text-navy px-5 py-2.5 text-[9px] uppercase font-bold tracking-widest transition-colors"
                >
                  Anchore Partnerspec
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* F. CLUB MEMBER COMPREHENSIVE MODAL */}
      {isClubMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-6 backdrop-blur-xs select-none">
          <div className="bg-white w-full max-w-2xl border shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto border-gold">
            <button
              onClick={() => setIsClubMemberModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-lg text-text-dark font-semibold border-b pb-3 mb-6">
              {editingClubMember ? "Modify Member Specs" : "Register New Elite Member Code"}
            </h3>

            <form onSubmit={handleSaveClubMember} className="space-y-4 text-xs font-sans">
              <div className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 block uppercase font-bold">Full Human Name *</label>
                    <input
                      type="text"
                      required
                      value={clubMemberForm.name}
                      onChange={(e) => setClubMemberForm({ ...clubMemberForm, name: e.target.value })}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none text-text-dark font-medium"
                      placeholder="e.g. Kazi Syed Ali Farhad"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 block uppercase font-bold">Email Address</label>
                    <input
                      type="email"
                      value={clubMemberForm.email}
                      onChange={(e) => setClubMemberForm({ ...clubMemberForm, email: e.target.value })}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none text-text-dark"
                      placeholder="e.g. name@cbbcl-member.org"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 block uppercase font-bold">Membership Category Class *</label>
                    <select
                      value={clubMemberForm.membershipType}
                      onChange={(e) => handleClubMemberTypeChange(e.target.value as any)}
                      className="w-full border p-2.5 bg-slate-50 outline-none text-text-dark font-medium"
                    >
                      <option value="Life Member">Life Member</option>
                      <option value="Permanent Member">Permanent Member</option>
                      <option value="Associate Member">Associate Member</option>
                      <option value="Donor Member">Donor Member</option>
                      <option value="Honorary Member">Honorary Member</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-450 block uppercase font-bold">Unique Membership Code *</label>
                      <label className="flex items-center space-x-1 cursor-pointer font-bold uppercase text-[8px] tracking-tight">
                        <input
                          type="checkbox"
                          checked={clubMemberForm.isAutoCode}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const code = checked 
                              ? generateNextMembershipCode(clubMemberForm.membershipType, clubMembers)
                              : clubMemberForm.membershipCode;
                            setClubMemberForm({
                              ...clubMemberForm,
                              isAutoCode: checked,
                              membershipCode: code
                            });
                          }}
                        />
                        <span>Auto-Gen</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      required
                      disabled={clubMemberForm.isAutoCode}
                      value={clubMemberForm.membershipCode}
                      onChange={(e) => setClubMemberForm({ ...clubMemberForm, membershipCode: e.target.value })}
                      className={`w-full border p-2.5 outline-none text-text-dark font-mono font-bold ${
                        clubMemberForm.isAutoCode ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-navy focus:bg-white"
                      }`}
                      placeholder="CBBCL-LIFEMEMBER-001"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 block uppercase font-bold">Official Registry Join Date</label>
                    <input
                      type="date"
                      required
                      value={clubMemberForm.joinDate}
                      onChange={(e) => setClubMemberForm({ ...clubMemberForm, joinDate: e.target.value })}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none text-text-dark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-1">
                    <ImageUpload
                      value={clubMemberForm.avatarUrl}
                      onChange={(base64) => setClubMemberForm({ ...clubMemberForm, avatarUrl: base64 })}
                      onClear={() => setClubMemberForm({ ...clubMemberForm, avatarUrl: "" })}
                      label="Profile Avatar Portrait"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 block uppercase font-bold">Status *</label>
                      <select
                        value={clubMemberForm.status}
                        onChange={(e) => setClubMemberForm({ ...clubMemberForm, status: e.target.value as any })}
                        className="w-full border p-2.5 bg-slate-50 outline-none text-text-dark font-medium"
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450 block uppercase font-bold">Institutional Member Category *</label>
                      <select
                        value={clubMemberForm.category}
                        onChange={(e) => setClubMemberForm({ ...clubMemberForm, category: e.target.value as any })}
                        className="w-full border p-2.5 bg-slate-50 outline-none text-text-dark font-medium"
                      >
                        <option value="Founding Member">Founding Member</option>
                        <option value="Executive Officer">Executive Officer</option>
                        <option value="General Member">General Member</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 border-t pt-4">
                  <label className="text-[10px] text-slate-455 block uppercase font-bold">Biographical Narrative / Introduction Statement</label>
                  <textarea
                    value={clubMemberForm.bio}
                    onChange={(e) => setClubMemberForm({ ...clubMemberForm, bio: e.target.value })}
                    className="w-full border p-2.5 bg-slate-50 focus:bg-white outline-none text-text-dark text-xs"
                    rows={2}
                    placeholder="Brief description of the member's professional profile, history, or background..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-455 block uppercase font-bold">Noteworthy Achievements / Accolades</label>
                    <input
                      type="text"
                      value={clubMemberForm.achievements}
                      onChange={(e) => setClubMemberForm({ ...clubMemberForm, achievements: e.target.value })}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white text-xs text-text-dark"
                      placeholder="e.g. CIP Status, Marine Merit Silver Medalist"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-455 block uppercase font-bold font-bold">Club Involvement Context</label>
                    <input
                      type="text"
                      value={clubMemberForm.clubInvolvement}
                      onChange={(e) => setClubMemberForm({ ...clubMemberForm, clubInvolvement: e.target.value })}
                      className="w-full border p-2.5 bg-slate-50 focus:bg-white text-xs text-text-dark"
                      placeholder="e.g. Founding patron, beach preservation sponsor"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsClubMemberModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-[9px] uppercase font-bold tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-navy hover:bg-gold text-white hover:text-navy px-5 py-2.5 text-[9px] uppercase font-bold tracking-widest transition-all"
                >
                  Save Member Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
