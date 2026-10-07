import { Director, NewsPost, EventItem, Facility, Affiliation } from "./types";
// @ts-ignore
import farhanBinRafiqPortrait from "./assets/images/board/farhan-bin-rafiq.png";
// @ts-ignore
import amzadMahmudPortrait from "./assets/images/board/amzad-mahmud.png";
// @ts-ignore
import mohammedEliasPortrait from "./assets/images/board/mohammed-elias.png";
// @ts-ignore
import mdYousufPortrait from "./assets/images/board/md-yousuf.png";
// @ts-ignore
import nurulAbsarPortrait from "./assets/images/board/nurul-absar.png";
// @ts-ignore
import presidentPortrait from "./assets/images/board/humayun-kabir-robel.png";
// @ts-ignore
import arifurRahmanPortrait from "./assets/images/board/arifur-rahman.png";
// @ts-ignore
import akRubelPortrait from "./assets/images/board/ak-rubel.jpg";
// @ts-ignore
import maimunalKarimJisanPortrait from "./assets/images/board/maimunal-karim-jisan.jpg";
// @ts-ignore
import mdImranAlamPortrait from "./assets/images/board/md-imran-alam.png";
// @ts-ignore
import mdRezaulKabirRezaPortrait from "./assets/images/board/md-rezaul-kabir-reza.png";
// @ts-ignore
import mehediHasanPortrait from "./assets/images/board/mehedi-hasan.png";
// @ts-ignore
import rasadulMaimunEvoPortrait from "./assets/images/board/reshedul-evu.jpg";
// @ts-ignore
import ziaulHoquePortrait from "./assets/images/board/ziaul-haque.png";
// @ts-ignore
import heroVideo from "./assets/videos/hero.mp4";

export const PRESIDENT_IMAGE = presidentPortrait;
export const FARHAN_BIN_RAFIQ_IMAGE = farhanBinRafiqPortrait;
export const ARIFUR_RAHMAN_IMAGE = arifurRahmanPortrait;
export const AMZAD_MAHMUD_IMAGE = amzadMahmudPortrait;
export const MOHAMMED_ELIAS_IMAGE = mohammedEliasPortrait;
export const MD_YOUSUF_IMAGE = mdYousufPortrait;
export const NURUL_ABSAR_IMAGE = nurulAbsarPortrait;
export const AK_RUBEL_IMAGE = akRubelPortrait;
export const MAIMUNAL_KARIM_JISAN_IMAGE = maimunalKarimJisanPortrait;
export const MD_IMRAN_ALAM_IMAGE = mdImranAlamPortrait;
export const MD_REZAUL_KABIR_REZA_IMAGE = mdRezaulKabirRezaPortrait;
export const MEHEDI_HASAN_IMAGE = mehediHasanPortrait;
export const RESHEDUL_EVU_IMAGE = rasadulMaimunEvoPortrait;
export const MD_ZIAUL_HOQUE = {
  name: "MD. Ziaul Hoque",
  image: ziaulHoquePortrait
};
export const MASTER_HERO_VIDEO = heroVideo;

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
    id: "arifur-rahman",
    name: "Arifur Rahman",
    designation: "Director Finance",
    membershipCode: "CBBCL-FOUNDER-004"
  },
  {
    id: "mehedi-hasan",
    name: "Mehedi Hasan",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-005",
    profileSubmitted: true,
    profileRevision: 3,
    bio: [
      "Mehedi Hasan is a Founder Director of Cox's Bazar Boat Club Limited (CBBCL). His professional experience brings together business leadership, teaching, and training in the tourism and hospitality sector.",
      "He is the Managing Director of M I Enterprise and the Owner of Humasa Fashion Gallery. His business activities also include importing products from China and Pakistan.",
      "From 2012 to 2026, he worked in teaching. Between 2017 and 2023, he served as Coordinator and Trainer in the Tourism and Hospitality Sector at SEIP under the Ministry of Finance. He also serves as a Guest Teacher at Cox's Bazar Government Polytechnic Institute.",
      "His professional development includes training in the methodology of CBTA and an international course in food safety and hygiene completed at Nanyang Polytechnic Institute in Singapore. These roles reflect his involvement in enterprise, education, and hospitality-related professional development."
    ],
    vision: [
      "His vision for CBBCL is to build a welcoming, well-managed boat club where members and guests can enjoy safe, high-quality boating and hospitality experiences. He wants the Club to contribute positively to Cox's Bazar through responsible use of coastal and marine resources, care for the environment, and strong connections with the local community.",
      "He sees tourism, hospitality, and professional learning as areas that can support one another, creating opportunities for young people and local businesses while respecting the coast that makes the region distinctive. He also aims to promote awareness of coastal responsibility among members and visitors, supporting a Club culture that values both leisure and stewardship.",
      "Through member participation and responsible development, he hopes CBBCL will become a respected destination for recreation, community connection, and sustainable coastal tourism."
    ],
    businessProfile: {
      // Multiple entries are separated by "; ".
      role: "Managing Director, M I Enterprise; Owner, Humasa Fashion Gallery; Guest Teacher, Cox's Bazar Government Polytechnic Institute; Trainer in the Tourism and Hospitality Sector",
      company: "M I Enterprise; Humasa Fashion Gallery; Cox's Bazar Government Polytechnic Institute",
      industry: "Tourism and Hospitality; Education and Training; Enterprise",
      interests: "Import and trading; Enterprise; Tourism and Hospitality; Education and Training",
      website: "https://mienterprise.shop"
    },
    socials: {
      facebook: "https://www.facebook.com/mehedihasan546",
      email: "mehedihasan546@gmail.com"
    },
    achievements: [
      "2018 — International course in Food Safety and Hygiene, Nanyang Polytechnic Institute, Singapore",
      "2016 — Training in the methodology of CBTA, BTEB"
    ],
    timeline: [
      { year: "2012–2026", event: "Teaching" },
      { year: "2017–2023", event: "Coordinator and Trainer in the Tourism and Hospitality Sector at SEIP, Ministry of Finance" }
    ]
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
    membershipCode: "CBBCL-FOUNDER-010",
    profileSubmitted: true,
    profileRevision: 3,
    photoAlt: "Official portrait of Ahmedul Karim Rubel, Member of the Board of Directors, Cox's Bazar Boat Club Ltd.",
    bio: [
      "Ahmedul Karim Rubel is a successful businessman and entrepreneur. He completed his Master of Business Administration (MBA) at International Islamic University Chittagong (IIUC) in 2016.",
      "Immediately after completing his education, he stepped into the business sector and founded M/S Shara Traders as its proprietor in 2017. Through this enterprise, he has been operating successfully as a contractor and supplier for various government development projects, delivering quality goods.",
      "Expanding his business horizon, he entered the automobile sector in 2024 as a partner in Maher Trading, which imports and sells Japanese reconditioned cars, earning a reputable position in the market.",
      "As a dedicated member of Cox's Bazar Boat Club Limited, he actively contributes to the overall development of the Club, the promotion of marine tourism and water sports, and the enhancement of social engagement."
    ],
    businessProfile: {
      // Multiple entries are separated by "; ".
      role: "Proprietor, M/S Shara Traders; Managing Partner, Maher Trading",
      company: "M/S Shara Traders; Maher Trading",
      industry: "Contracting; Supplying; Automobile Import",
      interests: "Public Contracting & Supply Chain; Japanese Car Import & Sales"
    },
    memberships: [
      "Cox's Bazar Boat Club Limited — Board of Directors / Executive Member"
    ],
    socials: {
      facebook: "https://www.facebook.com/rubel.rf",
      email: "ak.rubel1989@gmail.com, ak.rubel91@gmail.com"
    },
    timeline: [
      { year: "2016", event: "Successfully completed an MBA at International Islamic University Chittagong (IIUC)." },
      { year: "2017", event: "Established M/S Shara Traders as proprietor in the contracting and supplying business and commenced operations." },
      { year: "2024", event: "Expanded into the automobile industry as a partner in Maher Trading, starting a Japanese reconditioned car import and showroom business." }
    ]
  },
  {
    id: "mohammed-elias",
    name: "Mohammad Eliyas",
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
    name: MD_ZIAUL_HOQUE.name,
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-014"
  },
  {
    id: "reshedul-evu",
    name: "Rasadul Maimun Evo",
    designation: "Founding Director",
    membershipCode: "CBBCL-FOUNDER-015",
    photoUrl: RESHEDUL_EVU_IMAGE,
    businessProfile: {
      // Multiple businesses are separated by "; " so they survive the admin form's single-line company field.
      company: "Rasad Filling Station; Rasad LPG Filling Station; M/S Mijab Traders; M/S Mawa LPG Cylinder Refilling Station; M/S RMM Brick Manufacturing; M/S RMM Salt Crushing Industry; M/S RMM Rubber Plantation",
      role: "Proprietor",
      industry: ""
    }
  }
];

export const FACILITIES_DATA: Facility[] = [
  {
    id: "private-hotel",
    name: "Private Hotel",
    description: "Private guest accommodation within the club for members and their invited guests, offering a quiet, comfortable stay close to the club's dining, lounge, and marine facilities.",
    features: ["Private guest rooms", "For members & invited guests", "Steps from club dining & lounge", "Advance reservation"],
    capacity: "By reservation",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "boating-yacht",
    name: "Boating & Yacht",
    description: "Boating and yachting experiences on the Bay of Bengal for members and their guests, with an emphasis on safe, well-managed outings and responsible use of the coast.",
    features: ["Boating excursions", "Yacht outings", "Safety-first operations", "For members & guests"],
    capacity: "By reservation",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200"
  },
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
    id: "2",
    title: "Welcome Message from Founding President Humayun Kabir Robel",
    date: "June 01, 2026",
    category: "Announcements",
    year: "2026",
    month: "June",
    excerpt: "On our founding month, President Humayun Kabir Robel shares his bold vision for the future of nautical leisure and membership prestige at CBBCL.",
    content: "Dear Founding Members and Guests, as we embark on this exciting journey, I welcome you to Cox’s Bazar Boat Club Limited. Our club represents more than just a leisure resort. It is a long-awaited vision to anchor the elite social, maritime, and philanthropic networks of Bangladesh on the longest natural sea beach in the world. CBBCL will act as a luxurious maritime haven that promotes yachting, water sports, and environmental preservation while fostering tight-knit camaraderie. Our board is committed to developing state-of-the-art facilities and securing reciprocal arrangements with elite global clubs.",
    tags: ["president", "welcome", "vision", "cbbcl"],
    image: PRESIDENT_IMAGE,
    // Wide news cards crop the centre; frame from the top so his face stays in view.
    imagePosition: "center 12%",
    likes: 0,
    commentsCount: 0
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

// No affiliations are published until real ones are confirmed.
export const AFFILIATIONS_DATA: Affiliation[] = [];
