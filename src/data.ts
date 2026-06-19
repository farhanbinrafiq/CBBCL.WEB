import { Director, NewsPost, EventItem, Facility, Affiliation } from "./types";

export const PRESIDENT_IMAGE = "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880795/HKR_t7xu7d.png";
export const AK_RUBEL_IMAGE = "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781886344/AKRB_v2_lihuhg.jpg";
export const MAIMUNAL_KARIM_JISAN_IMAGE = "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781894886/IMG-20260619-WA0013_edit_31000412747443_t2sefa.jpg";
export const MD_IMRAN_ALAM_IMAGE = "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781893293/white_bg_20260620_001621_0000_lzshvp.png";
export const MD_REZAUL_KABIR_REZA_IMAGE = "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781895223/white_bg_20260620_005151_0000_geiljj.png";
export const MASTER_HERO_VIDEO = "https://res.cloudinary.com/djdyqr8yd/video/upload/v1781881396/14818372_3840_2160_24fps_pa7yjz.mp4";

export const DIRECTORS_DATA: Director[] = [
  {
    id: "humayun-kabir-robel",
    name: "Humayun Kabir Robel",
    designation: "Founding President",
    membershipCode: "CBBCL-FOUNDER-001",
    appointed: "January 2026",
    bio: [
      "Humayun Kabir Robel is an eminent industrialist, philanthropist, and pioneering figure in Bangladesh's maritime recreation sector. With over two decades of leadership experience across shipping, real estate, and hospitality, he envisioned Cox's Bazar Boat Club Limited as a world-class hub that bridges community integration with nautical advocacy.",
      "Under his visionary leadership, the club was incorporated as a private non-profit Company Limited by Guarantee under The Companies Act, 1994, aiming to elevate the social and recreational stature of Cox's Bazar. His commitment to establishing an elite, premium-tier institution comparable to the historic clubs of South Asia has been the driving force behind this landmark initiative.",
      "As the Founding President, he continues to guide the executive committees, international affiliation efforts, and the architectural master planning of the club's state-of-the-art permanent clubhouse, ensuring it meets international standards for luxury and environmental sustainability."
    ],
    businessProfile: {
      company: "Bengal Horizon Shipping & Logistics Group",
      role: "Chairman & Managing Director",
      industry: "Maritime Logistics & Hospitality"
    },
    achievements: [
      "Recipient of the National Maritime Entrepreneurship Award (2024)",
      "Pioneered the first eco-friendly passenger catamaran service on the Cox's Bazar-Saint Martin's route",
      "Recognized Commercially Important Person (CIP) by the Ministry of Industries"
    ],
    memberships: [
      "Life Member, Dhaka Club Limited",
      "Permanent Member, Chittagong Club Limited",
      "Executive Committee, Bangladesh Shipping Agents' Association"
    ],
    community: [
      "Trustee, Cox's Bazar Marine Conservation Foundation",
      "Patron, Robel Welfare Trust for Coastal Communities",
      "Donor Member, Cox's Bazar Red Crescent Society"
    ],
    timeline: [
      { year: "2026", event: "Incorporated and launched Cox's Bazar Boat Club Limited as Founding President" },
      { year: "2022", event: "Acquired the coastal parcel for the premium marine recreation complex" },
      { year: "2018", event: "Established Bengal Horizon Marine Academy to train underprivileged coastal youths" },
      { year: "2012", event: "Launched first luxury charter sailboat cruise in the Bay of Bengal" },
      { year: "2005", event: "Founded Bengal Horizon Logistics, marking a milestone in Bangladesh maritime cargo transport" }
    ]
  },
  {
    id: "farhan-bin-rafiq",
    name: "Farhan Bin Rafiq",
    designation: "Founding Vice President",
    membershipCode: "CBBCL-FOUNDER-002"
  },
  {
    id: "syfuddin-khaled",
    name: "Syfuddin Khaled",
    designation: "Director Administration",
    membershipCode: "CBBCL-FOUNDER-003"
  },
  {
    id: "arifur-rahman",
    name: "Arifur Rahman",
    designation: "Director Finance",
    membershipCode: "CBBCL-FOUNDER-004"
  },
  {
    id: "mehedi-hasan",
    name: "Mehedi Hasan",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-005"
  },
  {
    id: "md-imran-alam",
    name: "Md Imran Alam",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-006"
  },
  {
    id: "maimunal-karim-jisan",
    name: "Maimunal Karim Jisan",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-007"
  },
  {
    id: "md-rezaul-kabir-reza",
    name: "Md Rezaul Kabir Reza",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-008"
  },
  {
    id: "amzad-mahmud",
    name: "Amzad Mahmud",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-009"
  },
  {
    id: "ak-rubel",
    name: "Ahmedul Karim Rubel",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-010"
  },
  {
    id: "mohammed-elias",
    name: "Mohammed Elias",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-011"
  },
  {
    id: "md-yousuf",
    name: "Md Yousuf",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-012"
  },
  {
    id: "nurul-absar",
    name: "Nurul Absar",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-013"
  },
  {
    id: "ziaul-haque",
    name: "Ziaul Haque",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-014"
  },
  {
    id: "reshedul-evu",
    name: "Reshedul Evu",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-015"
  }
];

export const FACILITIES_DATA: Facility[] = [
  {
    id: "lounge",
    name: "Club Lounge",
    description: "An elegant coastal sanctuary tailored for intimate gatherings and quiet contemplation. Featuring expansive floor-to-ceiling windows, our main Lounge offers breathtaking panoramic vistas of the sunset over the Bay of Bengal, curated artwork, and bespoke leather seating configurations.",
    features: ["Sunset panoramas", "Bespoke leather furnishings", "Premium beverage selections", "Dedicated sommelier service"],
    capacity: "80 Guests",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "dining",
    name: "Restaurant & Dining",
    description: "An exceptional culinary destination serving the finest South Asian, fresh local catch, and international continental cuisines. Led by award-winning resident chefs, our dining rooms present customized degustation menus paired with stellar hospitality, overlooking the private club marina.",
    features: ["Seafood specialized menu", "Intimate private dining rooms", "Local authentic fusion", "Chef's Table dining"],
    capacity: "120 Seats",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "banquet",
    name: "Banquet Hall",
    description: "The crown jewel of our club facilities, the Grand Ballroom is designed for high-profile galas, corporate annual meetings, and distinguished matrimonial celebrations. Complemented by pre-function foyers, stage rigging, and premium oceanfront lawns.",
    features: ["Direct beach-access lawn", "State-of-the-art acoustics", "Inhouse banqueting team", "VIP holding rooms"],
    capacity: "450 Guests",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "conference",
    name: "Conference Facilities",
    description: "Fully-appointed corporate boardrooms and meeting lounges designed for modern dynamic executives. Standard equipped with ultra-high-definition interactive displays, secure high-speed network connections, and corporate catering services.",
    features: ["Secure video-conferencing suites", "Interactive whiteboard screens", "Ergonomic seating layout", "In-room business host"],
    capacity: "25 - 40 Seats",
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "recreation",
    name: "Family Recreation Area",
    description: "A thoughtful sanctuary for members and their children. Includes soft indoor play zones, interactive library corners, video console zones, and outdoor landscaped lawns for light family activities under meticulous club host supervision.",
    features: ["Supervised children's zone", "Family picnic decks", "Dynamic boarding games", "Digital entertainment hub"],
    capacity: "60 Guests",
    image: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "sports",
    name: "Sports Facilities",
    description: "Elegantly constructed fitness, billiard rooms, and tennis courts designed to satisfy athletic lifestyle standards. Fully climate-controlled interior zones accompanied by experienced personal trainers and dedicated squash or tennis professionals.",
    features: ["Championship Snooker tables", "Oceanfront modern fitness center", "Clay-court tennis", "Locker & steam rooms"],
    capacity: "50 Athletes",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "developments",
    name: "Future Developments",
    description: "A visionary blueprint of CBBCL's future expansions, including the private marina slips, deep-sea sailing slips, infinity pools overlooking the pristine shoreline, and high-security luxury coastal cottages designated exclusively for Member weekend retreats.",
    features: ["50-berth private marina", "Heated salt-water infinity pool", "Luxury coastal villas", "Maritime rescue helipad"],
    capacity: "N/A",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200"
  }
];

export const NEWS_DATA: NewsPost[] = [
  {
    id: "1",
    title: "Official Incorporation of Cox’s Bazar Boat Club Limited",
    date: "June 05, 2026",
    category: "News",
    year: "2026",
    month: "June",
    excerpt: "Cox’s Bazar Boat Club Limited has been officially registered and incorporated under The Companies Act, 1994, as a premier private socio-cultural non-profit entity.",
    content: "We are immensely proud to announce the formal registration and incorporation of Cox’s Bazar Boat Club Limited (CBBCL). Duly recognized by the Registrar of Joint Stock Companies and Firms (RJSC) under The Companies Act, 1994, Bangladesh, as a Company Limited by Guarantee, CBBCL is structuralized as an elite non-profit. This establishes our statutory foundation to deliver world-class nautical facilities, social spaces, and marine conservation programs to our exclusive members, setting a benchmark parallel to the prestigious historic clubs across South Asia.",
    tags: ["incorporation", "legal", "official", "governance"],
    likes: 124,
    commentsCount: 18
  },
  {
    id: "2",
    title: "Welcome Message from Founding President Humayun Kabir Robel",
    date: "June 01, 2026",
    category: "Announcements",
    year: "2026",
    month: "June",
    excerpt: "On our founding month, President Humayun Kabir Robel shares his bold vision for the future of nautical leisure and membership prestige at CBBCL.",
    content: "Dear Founding Members and Guests, as we embark on this exciting journey, I welcome you to Cox’s Bazar Boat Club Limited. Our club represents more than just a leisure resort. It is a long-awaited vision to anchor the elite social, maritime, and philanthropic networks of Bangladesh on the longest natural sea beach in the world. CBBCL will act as a luxurious maritime haven that promotes yachting, water sports, and environmental preservation while fostering tight-knit camaraderie. Our board is committed to developing state-of-the-art facilities and securing reciprocal arrangements with elite global clubs.",
    tags: ["president", "welcome", "vision", "cbbcl"],
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
    likes: 245,
    commentsCount: 32
  },
  {
    id: "3",
    title: "Inaugural Session of the CBBCL Board of Directors",
    date: "May 25, 2026",
    category: "Governance",
    year: "2026",
    month: "May",
    excerpt: "The newly formed Board of Directors successfully passed the master blueprint and designated the first administrative task-forces.",
    content: "The inaugural meeting of the Board of Directors of Cox’s Bazar Boat Club Limited was convened on May 25, 2026, under the chairmanship of Founding President Humayun Kabir Robel. The session saw the active attendance of Founding Vice President Farhan Bin Rafiq, Director Administration Syfuddin Khaled, Director Finance Arifur Rahman, and all 11 Founding Directors. The board approved the pre-development master plans for our landmark clubhouse and formalised the appointment of the Executive Sub-Committees for Rules, Membership Scrutiny, and Sports.",
    tags: ["board", "meeting", "governance", "blueprints"],
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    likes: 98,
    commentsCount: 6
  },
  {
    id: "4",
    title: "Groundbreaking Construction Updates on Clubhouse & Slipway",
    date: "May 18, 2026",
    category: "News",
    year: "2026",
    month: "May",
    excerpt: "Piling operations and safety slipway construction have commenced on the club's scenic shoreline site.",
    content: "Civil engineering consultants have initiated ground trials and foundation piling operations on CBBCL's ocean-facing land site. The first phase includes building a heavy-grade maritime slipway designed to facilitate safe, direct launch and recovery operations for recreational motorboats and sailboats. Environmental mitigation boundaries have been fortified using bio-engineering geotextiles to protect the fragile coastal sand dunes, emphasizing our commitment to ecological responsibility.",
    tags: ["construction", "infrastructure", "marina", "clubhouse"],
    image: "https://images.unsplash.com/photo-1504150558553-0bbe79316bb0?auto=format&fit=crop&q=80&w=800",
    likes: 156,
    commentsCount: 22
  },
  {
    id: "5",
    title: "CBBCL Launch of the Executive Membership Drive 2026",
    date: "April 29, 2026",
    category: "Announcements",
    year: "2026",
    month: "April",
    excerpt: "Exclusive invitations are now being dispatched to distinguished citizens, corporate chiefs, and diplomatic missions.",
    content: "The Membership Committee of Cox’s Bazar Boat Club Limited is thrilled to announce that applications are open for our inaugural founding membership cycle. Since CBBCL is structured to sustain an intimate and high-profile community, admissions will undergo highly protective, multi-tier vetting by our Scrutiny Committee. Interested patrons may request the official Club Prospectus directly via corporate invitation or verified members' proposals in Donor, Life, and Permanent categories.",
    tags: ["membership", "drive", "admissions", "exclusive"],
    likes: 182,
    commentsCount: 41
  },
  {
    id: "6",
    title: "Inaugural Gala Dinner & Charter Presentation Set for July",
    date: "April 15, 2026",
    category: "Events",
    year: "2026",
    month: "April",
    excerpt: "CBBCL will host its grand formal charter presentation at the Grand Ballroom, welcoming global nautical ambassadors.",
    content: "The social highlight of the season, our Inaugural Charter Gala Dinner, will take place on Saturday evening in July 2026. The black-tie affair will officially salute our Founding Members. The night features a customized five-course symphonic menu, live chamber orchestration, and a symbolic anchor-raising toast led by our executive committee to declare the club's social calendar active.",
    tags: ["gala", "dinner", "charter", "blacktie"],
    likes: 310,
    commentsCount: 56
  },
  {
    id: "7",
    title: "Cox's Bazar Beach Cleanup: Corporate Social Responsibility Initiative",
    date: "March 22, 2026",
    category: "CSR",
    year: "2026",
    month: "March",
    excerpt: "CBBCL directors, patrons, and volunteers successfully cleared beach zones in a coordinated eco-campaign.",
    content: "Demonstrating our core belief that luxury and ecological stewardship must sail together, CBBCL successfully organized its first Quarterly Beach Cleanup Campaign. Over eighty volunteers, led actively by the founding directors, gathered at the sunrise light to remove plastic wastes and discarded fishing gear from surrounding dune habitats. Coordinated in collaboration with regional conservationists, the campaign highlights our lasting focus on preserving the beauty of Cox's Bazar.",
    tags: ["csr", "beach", "cleanup", "eco", "volunteer"],
    image: "https://images.unsplash.com/photo-1621451537084-482c7307370f?auto=format&fit=crop&q=80&w=800",
    likes: 201,
    commentsCount: 29
  },
  {
    id: "8",
    title: "Executive Standing Committee Appointed for Sports & Safety",
    date: "March 10, 2026",
    category: "Governance",
    year: "2026",
    month: "March",
    excerpt: "The Board announced the formation of eight primary standing committees to guide club divisions.",
    content: "To support flawless operations, the Board of Directors of Cox’s Bazar Boat Club Limited has structuralized eight dedicated Standing Committees under special provisions of the Articles of Association. These include the Administration Committee, Finance Control Board, Marine Safety & Sailing Council, and Sports & Recreation Board. Each committee will be headed by an executive director to enforce rigorous safety regulations, design sports leagues, and ensure transparent capital allocation.",
    tags: ["governance", "committee", "sports", "safety", "board"],
    likes: 74,
    commentsCount: 4
  },
  {
    id: "9",
    title: "Annual Nautical Snooker & Billiard Championship Announced",
    date: "February 25, 2026",
    category: "Sports",
    year: "2026",
    month: "February",
    excerpt: "The sports desk announced the premier internal Snooker Cup to be hosted in our newly completed Billiard Hall.",
    content: "Prepare for competitive camaraderie! The CBBCL Sports Committee is launching our inaugural Nautical Snooker Championship. Our premium Billiard tables, manufactured in premium mahogany and competitive wool, will play host to a multi-bracket knock-out championship among elite members. Trophies and exclusive custom jacket blazers will be presented by the Founding President at the closing ceremony.",
    tags: ["sports", "snooker", "championship", "billiards"],
    likes: 112,
    commentsCount: 15
  },
  {
    id: "10",
    title: "Evening of Classical Symphony & Nautical Poetry",
    date: "February 12, 2026",
    category: "Cultural",
    year: "2026",
    month: "February",
    excerpt: "An exclusive acoustic musical evening hosted inside the Club Library for members and spouses.",
    content: "Celebrating Bengali classical literature and global sea shanties, CBBCL hosted an elegant acoustic recital in the Club Library. Featuring performances on classical sarod, flute, and piano, the intimate evening was accompanied by historical readings of Rabindranath Tagore and maritime poets. Guests enjoyed fine hot refreshments and gourmet canapés during the candlelit intermission.",
    tags: ["cultural", "symphony", "poetry", "music", "library"],
    likes: 121,
    commentsCount: 10
  },
  {
    id: "11",
    title: "CBBCL Signs Historic Reciprocal Affiliation MoU",
    date: "January 20, 2026",
    category: "News",
    year: "2026",
    month: "January",
    excerpt: "CBBCL establishes structural pathways to provide national reciprocal privileges with premium clubs.",
    content: "We are thrilled to report the signing of reciprocal intent MoUs with several respected private members' clubs in Dhaka and Chittagong. This establishes a framework where verified CBBCL members will enjoy access to prime sports rooms, meeting rooms, and guest suites during regional travel. Our affiliation cell continues to expand partnerships to major clubs in India, Thailand, and Singapore, boosting our global prestige.",
    tags: ["affiliations", "mou", "travel", "privileges"],
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
    likes: 189,
    commentsCount: 25
  },
  {
    id: "12",
    title: "A Cordial Welcome to Our First Batch of Elected Members",
    date: "January 05, 2026",
    category: "Announcements",
    year: "2026",
    month: "January",
    excerpt: "Following meticulous scrutiny, the club formalizes the registry of our initial corporate and life patrons.",
    content: "The Board of Directors extends its deepest congratulations and a warm welcome to the thirty-five distinguished applicants whose memberships were confirmed during the very first Scrutiny cycle. Comprising top CEOs, legal advocates, diplomats, and retired general staff officers, this foundational community anchors our identity. A private induction tea will be hosted at the club secretariat to present membership insignia pins.",
    tags: ["newmembers", "welcome", "induction", "registry"],
    likes: 140,
    commentsCount: 12
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: "e1",
    title: "Inaugural Charter Gala Dinner & Anchor Toast",
    date: "July 18, 2026",
    day: "18",
    month: "July",
    venue: "Main Oceanfront Lawn & Ballroom",
    category: "Official Ceremony",
    isUpcoming: true,
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
    description: "The grandest physical milestone on our 2026 schedule: the formal black-tie inaugural banquet celebrating the founding members of CBBCL under coastal stars.",
    registrationInfo: "RSVP strictly required through Member Concierge Desk. Limited seating available. Strict formal attire required (Black Tie, Dinner Jacket, or National Formal)."
  },
  {
    id: "e2",
    title: "Monsoon Yachting Seminar & Coastal Navigation Masterclass",
    date: "August 09, 2026",
    day: "09",
    month: "August",
    venue: "Main Conference Hall & Yacht Deck",
    category: "Educational",
    isUpcoming: true,
    image: "https://images.unsplash.com/photo-1505242844900-19279f22006?auto=format&fit=crop&q=80&w=800",
    description: "An intensive day focused on tidal currents, monsoon wind patterns in the Bay of Bengal, and luxury sailboat operations guided by retired naval command staff.",
    registrationInfo: "Complimentary admission for life and donor members. Corporate teams must pre-register by August 2."
  },
  {
    id: "e3",
    title: "Founders Ocean Cup: Autumn Snipe Class Regatta",
    date: "September 12, 2026",
    day: "12",
    month: "September",
    venue: "CBBCL Private Marina & High Sea Course",
    category: "Water Sports",
    isUpcoming: true,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    description: "Our inaugural outdoor coastal sailing race. Multi-crew dinghy snipe sailboats will compete across a selective 5-nautical-mile coastal buoy loop.",
    registrationInfo: "Open ONLY to CBBCL members and reciprocal club racers. Safety life-jackets, personal medical clearance, and basic sailing license are mandatory."
  }
];

export const PAST_EVENTS_DATA: EventItem[] = [
  {
    id: "pe1",
    title: "Historic Sign-off Ceremony & Official Press Launch",
    date: "June 05, 2026",
    day: "05",
    month: "June",
    venue: "Hotel Sea Albatross VIP Suite, Cox's Bazar",
    category: "Press Conference",
    isUpcoming: false,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
    description: "Formal declaration of the registration of the CBBCL under The Companies Act, 1994, directly accompanied by regional government officials, environment advocates, and national hospitality partners."
  },
  {
    id: "pe2",
    title: "Eco-Stewardship Beach Cleanup Drive 2026",
    date: "May 10, 2026",
    day: "10",
    month: "May",
    venue: "Surrounding Beach Dunes & Coral Shallows",
    category: "CSR",
    isUpcoming: false,
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    description: "Over 200 kilograms of coastal waste, microplastics, and discarded fishing nets successfully recycled. Sponsored as a primary bio-conservation step by our Board."
  },
  {
    id: "pe3",
    title: "VIP Nautical Conceptual Blueprint Exhibition",
    date: "April 02, 2026",
    day: "02",
    month: "April",
    venue: "Club Temporary Office Secretariat, Dhaka Club Lounge",
    category: "Exhibition",
    isUpcoming: false,
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
    description: "Unveiling the premium marine clubhouse designs and structural engineering strategies created by famous lead architects."
  }
];

export const AFFILIATIONS_DATA: Affiliation[] = [
  {
    id: "af1",
    name: "Royal Yacht Club of Bangladesh",
    description: "The peak naval sailing association in the nation, providing premium sailboat logs, youth navigation, and standard sailing licensure.",
    website: "https://royalyachtclub.bd",
    partnershipType: "Reciprocal & Training Ally"
  },
  {
    id: "af2",
    name: "The Dhaka Oceanfront Recreational League",
    description: "An elite alliance bringing special land and pool amenities, access to private tennis clubs, and reciprocal dining access to travelers in internal districts.",
    website: "https://dhakaoceanfront.org",
    partnershipType: "Full Reciprocal Partner"
  },
  {
    id: "af3",
    name: "Chittagong Mariners Club Limited",
    description: "Richly historical commercial shipping and yacht harbor based in Chittagong, enabling yacht dockage and reciprocal lounge entry during commercial transit.",
    website: "https://ctgmariners.com.bd",
    partnershipType: "Full Reciprocal Partner"
  },
  {
    id: "af4",
    name: "Sylhet Valley Leisure Sanctuary",
    description: "An exclusive inland golf resort, empowering members of CBBCL to pre-book 18-hole courses and premium luxury bungalow layouts at discounted tariffs.",
    website: "https://sylhetvalleyresort.bd",
    partnershipType: "Recreational Affiliate"
  },
  {
    id: "af5",
    name: "Grand Beach Resort & Golf, Cox's Bazar",
    description: "An elite resort neighbor of the Boat Club, offering temporary accommodation and wellness spas to touring members before the clubhouse villa completions.",
    website: "https://grandgolfresort.com",
    partnershipType: "Lodge & Wellness Partner"
  },
  {
    id: "af6",
    name: "Bengal Ocean Yachting Federation",
    description: "The regulatory body governing security, international yacht clearances, sailing regattas, and marine bio-protection policies in regional waters.",
    website: "https://bengalyachting.org",
    partnershipType: "Strategic Maritime Affiliate"
  },
  {
    id: "ezbooking",
    name: "EZBOOKING",
    description: "Official Online Travel Agency (OTA) partner of Cox's Bazar Boat Club Limited. Offering exclusive member discounts on global travel bookings, flights, and waterfront lodging catalogs.",
    website: "https://ezbooking.com",
    partnershipType: "Official OTA Partner"
  }
];
