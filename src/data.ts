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
    profileSubmitted: true,
    profileRevision: 2,
    photoAlt: "Humayun Kabir Robel, Founding President of Cox's Bazar Boat Club Ltd.",
    quote: "Building businesses, creating opportunities, and contributing to sustainable economic growth.",
    bio: [
      "Humayun Kabir Robel is a dynamic entrepreneur and corporate leader with over 13 years of professional experience across the real estate, construction, logistics, tourism, agro, and related business sectors.",
      "He is the Founder & CEO of Roshni Construction and M/S Kabir Enterprise and serves as Managing Director (Administration) of Chaytara Group, a diversified business group with sister concerns operating in rice milling, logistics supply to UN bodies and development organizations, construction, agro-business, tourism, and other sectors.",
      "With strong expertise in sales strategy, financial management, business development, and corporate leadership, he has played an active role in driving sustainable business growth, strengthening operational efficiency, and developing long-term strategic partnerships.",
      "His business interests extend across construction, real estate, logistics, agro-business, rice and flour milling, tourism, and related commercial activities. Through his leadership, he has focused on developing professionally managed ventures while creating opportunities for employment and economic participation.",
      "Beyond business, he is committed to employment generation, social initiatives, community development, and responsible corporate practices. Through his entrepreneurial journey, he continues to contribute to local economic development while building sustainable and professionally managed business ventures.",
      "As the Founding President of Cox's Bazar Boat Club Ltd., he provides leadership toward establishing the Club as a distinguished socio-cultural and nautical institution in Cox's Bazar, bringing together business, professional, social and community interests."
    ],
    vision: [
      "As Founding President, Humayun Kabir Robel is committed to building Cox's Bazar Boat Club Ltd. as a distinguished platform for social connection, professional networking, cultural engagement and nautical experiences."
    ],
    businessProfile: {
      // Multiple entries are separated by "; ".
      role: "Founder, CEO & Proprietor, Roshni Construction; Founder, CEO & Proprietor, M/S Kabir Enterprise; Managing Director (Administration), Chaytara Group; Managing Director, M/S Chaytara Construction; CEO, M/S Chaytara Rice & Flour Mills; CEO, M/S Chaytara CRH Mill; Director, Chaytara Agro; Authorised Dealer, Seven Rings Cement",
      company: "Roshni Construction; M/S Kabir Enterprise; Chaytara Group; M/S Chaytara Construction; M/S Chaytara Rice & Flour Mills; M/S Chaytara CRH Mill; Chaytara Agro",
      industry: "Real Estate; Construction; Logistics; Tourism; Agro-Business; Rice & Flour Milling; Supply & Distribution; Related Commercial Ventures",
      interests: "Business Development; Sales Strategy; Financial Management; Corporate Leadership; Construction; Real Estate; Logistics & Supply; Agro-Business; Rice & Flour Milling; Tourism; Strategic Partnerships; Sustainable Business Growth; Employment Generation"
    },
    achievements: [
      "13+ years of professional experience across real estate, construction, logistics, tourism, agro and related business sectors",
      "Entrepreneurial leadership — Founder & CEO of Roshni Construction and M/S Kabir Enterprise",
      "Corporate leadership — Managing Director (Administration) of Chaytara Group",
      "Business diversification — active leadership across construction, logistics, agro-business, rice milling, tourism and related commercial ventures",
      "CBBCL founding leadership — Founding President of Cox's Bazar Boat Club Ltd."
    ],
    memberships: [
      "Cox's Bazar Chamber of Commerce & Industry — Director",
      "Junior Chamber International (JCI), Cox's Bazar — Vice President",
      "Rotary Club of Cox's Bazar City — Director",
      "Cox's Bazar Boat Club Ltd. — Founding President"
    ],
    community: [
      "Employment generation & local economic development — business leadership focused on creating employment opportunities for the local community and workforce",
      "Community development & social initiatives — committed to community development and social initiatives alongside his professional and entrepreneurial activities",
      "Responsible corporate practices — promotes professionally managed and sustainable business ventures for business stakeholders and local communities"
    ],
    socials: {
      facebook: "https://www.facebook.com/hkrobel",
      instagram: "https://www.instagram.com/the____hk",
      email: "hkrobel@gmail.com"
    },
    timeline: [
      { year: "2026", event: "Appointed Founding President of Cox's Bazar Boat Club Ltd., leading the establishment and development of CBBCL as a prestigious socio-cultural and nautical institution." },
      { year: "Current", event: "Managing Director (Administration), Chaytara Group — corporate and administrative leadership across the diversified business group's operations." },
      { year: "Current", event: "Founder & CEO, Roshni Construction & M/S Kabir Enterprise — leads business development and operations across construction, real estate and related commercial activities." },
      { year: "Current", event: "Director, Cox's Bazar Chamber of Commerce & Industry — professional leadership within the local business and commercial community." },
      { year: "Current", event: "Vice President, Junior Chamber International (JCI), Cox's Bazar." },
      { year: "Current", event: "Director, Rotary Club of Cox's Bazar City — contributes to professional and community-oriented activities." },
      { year: "13+ Years", event: "Entrepreneurial and corporate career spanning real estate, construction, logistics, tourism, agro-business and related sectors." }
    ]
  },
  {
    id: "farhan-bin-rafiq",
    name: "Farhan Bin Rafiq",
    designation: "Founding Vice President",
    membershipCode: "CBBCL-FOUNDER-002",
    profileSubmitted: true,
    profileRevision: 6,
    photoAlt: "Official portrait of Farhan Bin Rafiq, Founding Vice President, Cox's Bazar Boat Club Ltd.",
    bio: [
      "Farhan Bin Rafiq is a founding leader of Cox's Bazar Boat Club Ltd., and an entrepreneur and business professional with a diverse background spanning hospitality, operations, business development, technology and e-commerce.",
      "He is the Founder of Choosify Technologies Ltd., a technology and digital commerce venture focused on product discovery, comparison, trusted sellers and modern e-commerce experiences. He also serves as an advisor and consultant to EZBOOKING.GLOBAL, an online travel and accommodation booking platform, and has been involved in creative digital initiatives such as Artveen / Tanveen's Art Escape.",
      "With more than ten years of professional experience across business operations, hospitality, client and vendor relationship management, business development, service operations and digital platforms, his career has been marked by significant progression — including seven internal promotions — reflecting his leadership, adaptability and operational excellence. He has worked with corporate organizations, international NGOs, strategic stakeholders and cross-functional teams.",
      "Beyond business, Farhan is engaged in youth and community leadership through JCI Cox's Bazar. Joining as a member in 2023, he has progressed to his current role as Local Director, taking part in community, environmental and social development initiatives.",
      "As Founding Vice President of Cox's Bazar Boat Club Ltd., he contributes his experience in entrepreneurship, hospitality, tourism, technology, branding and digital presence, operations, and community and stakeholder engagement toward the growth and strategic development of the Club. He also built the Club's official website, cbbcl.org."
    ],
    businessProfile: {
      // Multiple entries are separated by "; ".
      role: "Founder, Choosify Technologies Ltd.; Advisor / Consultant, EZBOOKING.GLOBAL; Creative digital initiative, Artveen / Tanveen's Art Escape",
      company: "Choosify Technologies Ltd.; Artveen / Tanveen's Art Escape",
      industry: "Technology & E-commerce; Hospitality & Tourism Technology; Digital Creative Platforms",
      interests: "E-commerce; Technology & Digital Platforms; Product Development; Hospitality & Tourism; Business Development; Digital Marketing; Entrepreneurship",
      website: "https://choosify.bd"
    },
    socials: {
      facebook: "https://www.facebook.com/farhanbinrafiq.me",
      linkedin: "https://www.linkedin.com/in/farhanbinrafiq/",
      email: "farhanbinrafiq@gmail.com, ceo@choosify.bd"
    },
    achievements: [
      "Built the official website of Cox's Bazar Boat Club Ltd. (cbbcl.org)",
      "Seven internal promotions over more than ten years of professional experience, reflecting consistent performance and growing management responsibility",
      "Master of Business Administration (MBA)",
      "Bachelor of Business Administration (BBA)"
    ],
    memberships: [
      "Cox's Bazar Boat Club Ltd. — Founding Vice President",
      "JCI Cox's Bazar — Local Director (member since 2023)"
    ],
    community: [
      "Project Green Cox's Bazar — environmental and tree plantation initiative with JCI Cox's Bazar",
      "ECCHE PURAN — community welfare initiative",
      "JCI Cox's Bazar youth leadership, community development and social welfare initiatives"
    ],
    timeline: [
      { year: "2023", event: "Joined JCI Cox's Bazar as a Member" },
      { year: "Current", event: "Local Director, JCI Cox's Bazar" },
      { year: "Current", event: "Founding Vice President, Cox's Bazar Boat Club Ltd." }
    ]
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
    membershipCode: "CBBCL-FOUNDER-006",
    profileSubmitted: true,
    profileRevision: 5,
    bio: [
      "Md. Imran Alam is a Director of Cox's Bazar Boat Club Limited (CBBCL), with professional experience spanning entrepreneurship, hospitality, commercial property, agriculture, dairy farming, and fisheries.",
      "He is the Managing Director of N. Alam Shopping Complex in Court Bazar, Ukhiya, Cox's Bazar, and the Proprietor of Shuvo Guest House and Hena Dairy Farm & Fish Farm. Through these ventures, he has developed experience in business management, hospitality operations, commercial property management, and local enterprise development.",
      "Alongside his business activities, he is actively involved in sports administration and community development. He serves as the Treasurer of the Ukhiya Upazila Players Association and is a Member of the Cox's Bazar District Players Association, contributing to the development and welfare of local athletes and sports activities.",
      "His professional journey reflects a commitment to entrepreneurship, responsible leadership, community engagement, and the development of opportunities for local businesses, young people, and the wider community of Cox's Bazar."
    ],
    vision: [
      "His vision for CBBCL is to contribute to building a professionally managed, welcoming, and responsible boat club that promotes recreation, tourism, boating, and meaningful social connections in Cox's Bazar.",
      "He believes CBBCL can play an important role in strengthening Cox's Bazar's tourism potential while creating opportunities for local businesses, young people, and the wider community. His vision includes promoting responsible boating, safety, environmental awareness, and a culture of respect among members and visitors.",
      "Through active member participation, responsible management, and community engagement, he hopes CBBCL will become a respected platform for recreation, networking, tourism, and sustainable coastal development in Cox's Bazar."
    ],
    businessProfile: {
      // Multiple entries are separated by "; ".
      role: "Managing Director, N. Alam Shopping Complex; Proprietor, Shuvo Guest House; Proprietor, Hena Dairy Farm & Fish Farm",
      company: "N. Alam Shopping Complex; Shuvo Guest House; Hena Dairy Farm & Fish Farm",
      industry: "Hospitality & Tourism; Commercial Real Estate; Agriculture & Dairy Farming; Fisheries",
      interests: "Real Estate & Commercial Development; Hospitality & Tourism; Agriculture & Dairy; Fisheries; Community & Sports Development"
    },
    achievements: [
      "Entrepreneurial portfolio — started and developed ventures in hospitality, commercial property, agriculture, dairy farming and fisheries in Ukhiya, Cox's Bazar since 2018",
      "Commercial leadership — Managing Director of N. Alam Shopping Complex, a major commercial establishment in Court Bazar, Ukhiya",
      "Hospitality & agri-business — Proprietor of Shuvo Guest House and Hena Dairy Farm & Fish Farm",
      "Sports administration — Treasurer of the Ukhiya Upazila Players Association (since 2026)",
      "CBBCL leadership — Director of Cox's Bazar Boat Club Limited"
    ],
    socials: {
      facebook: "https://www.facebook.com/moh.imarana.alama",
      email: "imranalam3333@gmail.com"
    },
    memberships: [
      "Cox's Bazar Boat Club Limited (CBBCL) — Director",
      "Ukhiya Upazila Players Association — Treasurer",
      "Cox's Bazar District Players Association — Member"
    ],
    timeline: [
      { year: "2018–Present", event: "Entrepreneurship & Business Management — started and developed entrepreneurial ventures in hospitality, commercial property, agriculture, dairy farming, and fisheries in Ukhiya, Cox's Bazar." },
      { year: "2018–Present", event: "Managing Director, N. Alam Shopping Complex — leading the management and development of a major commercial establishment in Court Bazar, Ukhiya, with a focus on business operations, commercial management, and local enterprise development." },
      { year: "2018–Present", event: "Proprietor, Shuvo Guest House — managing operations in the hospitality and accommodation sector, with a focus on service, guest experience, and business management." },
      { year: "2018–Present", event: "Proprietor, Hena Dairy Farm & Fish Farm — engaged in diversified agricultural activities, including dairy farming and fisheries." },
      { year: "2026–Present", event: "Treasurer, Ukhiya Upazila Players Association — leadership in sports administration, contributing to financial management, organizational activities, and the welfare and development of local athletes." },
      { year: "2026–Present", event: "Member, Cox's Bazar District Players Association — supporting sports development and the welfare of athletes at the district level." }
    ]
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
    profileRevision: 4,
    photoAlt: "Official portrait of Ahmedul Karim Rubel, Member of the Board of Directors, Cox's Bazar Boat Club Ltd.",
    bio: [
      "Ahmedul Karim Rubel is a dynamic business leader, entrepreneur, and a founding member of Cox's Bazar Boat Club Limited. He completed his Master of Business Administration (MBA) from the International Islamic University Chittagong (IIUC) in 2016.",
      "Embarking on his entrepreneurial journey in 2017, he established M/S Shara Traders as its sole proprietor. Under his leadership, the firm has built a strong reputation as a trusted government contractor and supplier, delivering high-quality products and services across various development projects.",
      "Expanding his business horizons in 2024, he entered the automobile industry as a Managing Partner at Maher Trading. Specializing in the import and retail of Japanese reconditioned vehicles, he has rapidly established a strong presence in the automotive market.",
      "From the inception of Cox's Bazar Boat Club Limited, Mr. Rubel has been deeply involved in shaping its vision, planning, and execution. As a founding member of the Board of Directors, he plays a key role in structuring the club's organization, operations, and long-term strategic initiatives.",
      "Driven by a passion to unlock the immense potential of marine and water-based tourism in Cox's Bazar, his goal is to establish a modern, safe, and world-class boat club. He is actively dedicated to advancing marine tourism, yachting, water sports, eco-friendly coastal recreation, and building a prestigious, sustainable club community."
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
