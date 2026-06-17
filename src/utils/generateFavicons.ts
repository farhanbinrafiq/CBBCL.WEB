import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function generateFavicons() {
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const svgPath = path.join(publicDir, "favicon.svg");
  if (!fs.existsSync(svgPath)) {
    console.error("Master favicon.svg not found in public directory! Make sure to create it first.");
    return;
  }

  const targets = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192x192.png", size: 192 },
    { name: "android-chrome-512x512.png", size: 512 },
    { name: "favicon.ico", size: 32 }
  ];

  console.log("CBBCL branding: Generating favicon assets from master vector...");

  for (const target of targets) {
    const outputPath = path.join(publicDir, target.name);
    try {
      await sharp(svgPath)
        .resize(target.size, target.size)
        .png()
        .toFile(outputPath);
      console.log(`CBBCL favicon generated: ${target.name} (${target.size}x${target.size})`);
    } catch (err) {
      console.error(`Failed to generate ${target.name}:`, err);
    }
  }

  // Also build PWA manifest file automatically
  const manifestPath = path.join(publicDir, "site.webmanifest");
  const manifestContent = {
    name: "CBBCL",
    short_name: "CBBCL",
    description: "Cox's Bazar Boat Club Limited",
    start_url: "/",
    display: "standalone",
    background_color: "#111625",
    theme_color: "#9e7f46",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  try {
    fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2), "utf-8");
    console.log("CBBCL branding: Generated site.webmanifest successfully!");
  } catch (err) {
    console.error("Failed to write site.webmanifest:", err);
  }
}
