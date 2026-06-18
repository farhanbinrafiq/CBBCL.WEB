import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { generateFavicons } from "./src/utils/generateFavicons";

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json());

// Serve uploads directory as static assets
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB restriction
});

// Path to file-based persistent storage
const DATA_FILE_PATH = path.join(process.cwd(), "data", "site_settings.json");

// Helper function to load settings
function getSiteSettings() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const config = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(config);
    }
  } catch (e) {
    console.error("Error loading site settings: ", e);
  }
  return {
    footer: {
      key: "footer",
      logo: {
        type: "image",
        url: "",
        alt: "Site Logo"
      },
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
    }
  };
}

// Helper function to write settings
function saveSiteSettings(settings: any) {
  try {
    const parentDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing site settings file: ", e);
  }
}

// Security: Custom validation and sanitization helpers
function cleanHTML(html: string): string {
  if (!html) return "";
  // Strip script tags and dangerous HTML attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/on\w+='[^']*'/g, "");
}

function isValidEmail(emailStr: string): boolean {
  if (!emailStr) return false;
  // Support multiple emails separated by commas or slashes
  const emails = emailStr.split(/[\s,;/]+/).filter(e => e.trim().length > 0);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.every(e => emailRegex.test(e.trim()));
}

function sanitizeObject(obj: any): any {
  if (typeof obj === "string") {
    return cleanHTML(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  if (obj !== null && typeof obj === "object") {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = sanitizeObject(obj[key]);
    }
    return result;
  }
  return obj;
}

// Authorization middleware
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userRole = req.headers["x-user-role"];
  if (!userRole) {
    return res.status(401).json({ error: "Unauthorized. Authentication credentials missing." });
  }
  next();
};

const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userRole = req.headers["x-user-role"];
  if (userRole !== "admin") {
    return res.status(403).json({ error: "Forbidden. Access restricted to admin users only." });
  }
  next();
};

// ==========================================
// API REST ENDPOINTS
// ==========================================

// GET footer settings
app.get("/api/cms/footer", (req, res) => {
  const currentStore = getSiteSettings();
  res.json(currentStore.footer);
});

// POST file upload (Admin only)
app.post("/api/upload", authMiddleware, isAdmin, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error: any) {
    console.error("File upload failure: ", error);
    res.status(500).json({ error: "Failed to upload logo image: " + error.message });
  }
});

// UPDATE footer settings (Admin only)
app.put("/api/cms/footer", authMiddleware, isAdmin, (req, res) => {
  try {
    const freshData = req.body;

    if (!freshData) {
      return res.status(400).json({ error: "Invalid request payload." });
    }

    // 1. Validation - Valid email check
    if (freshData.contact && freshData.contact.email) {
      if (!isValidEmail(freshData.contact.email)) {
        return res.status(400).json({ error: "Invalid email address format." });
      }
    }

    // 2. Validation - No empty urls in footer links
    if (Array.isArray(freshData.footerLinks)) {
      for (const group of freshData.footerLinks) {
        if (!group.title || group.title.trim() === "") {
          return res.status(400).json({ error: "Footer Link Category Group titles cannot be empty." });
        }
        if (Array.isArray(group.links)) {
          for (const link of group.links) {
            if (!link.name || link.name.trim() === "") {
              return res.status(400).json({ error: "Link names cannot be empty." });
            }
            if (!link.url || link.url.trim() === "") {
              return res.status(400).json({ error: "Link URLs cannot be empty." });
            }
          }
        }
      }
    }

    // 3. Validation - No empty urls in legal links
    if (Array.isArray(freshData.legalLinks)) {
      for (const link of freshData.legalLinks) {
        if (!link.name || link.name.trim() === "") {
          return res.status(400).json({ error: "Legal Link names cannot be empty." });
        }
        if (!link.url || link.url.trim() === "") {
          return res.status(400).json({ error: "Legal Link URLs cannot be empty." });
        }
      }
    }

    // 4. Sanitize Input
    const sanitized = sanitizeObject(freshData);

    // Save back to db
    const currentStore = getSiteSettings();
    currentStore.footer = {
      ...currentStore.footer,
      ...sanitized,
      key: "footer"
    };

    saveSiteSettings(currentStore);
    res.json(currentStore.footer);

  } catch (error: any) {
    console.error("Error updating footer settings: ", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// ==========================================
// VITE OR STATIC ASSETS ROUTING MIDDLEWARE
// ==========================================
async function setupVite() {
  // Generate favicons from vector SVG asset automatically on startup
  try {
    await generateFavicons();
  } catch (err) {
    console.warn("Favicon asset generation warning (non-blocking):", err);
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static build assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server listening at http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Vite setup failure: ", err);
  process.exit(1);
});
