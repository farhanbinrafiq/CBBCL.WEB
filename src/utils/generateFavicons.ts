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

  // Standard favicons (transparent background for clean browser tabs integration)
  const standerFavicons = [
    { name: "favicon-16x16.png", size: 16, solidBg: false },
    { name: "favicon-32x32.png", size: 32, solidBg: false },
    { name: "favicon.ico", size: 32, solidBg: false }
  ];

  // PWA & Touch screen icons (solid corporate Dark Navy #002262 background per branding guidelines)
  const appIcons = [
    { name: "pwaicon-72x72.png", size: 72, solidBg: true },
    { name: "pwaicon-96x96.png", size: 96, solidBg: true },
    { name: "pwaicon-128x128.png", size: 128, solidBg: true },
    { name: "pwaicon-144x144.png", size: 144, solidBg: true },
    { name: "pwaicon-152x152.png", size: 152, solidBg: true },
    { name: "android-chrome-192x192.png", size: 192, solidBg: true },
    { name: "pwaicon-384x384.png", size: 384, solidBg: true },
    { name: "android-chrome-512x512.png", size: 512, solidBg: true },
    { name: "apple-touch-icon.png", size: 180, solidBg: true }
  ];

  const allTargets = [...standerFavicons, ...appIcons];

  console.log("CBBCL branding: Generating premium favicon and PWA assets from master vector...");

  for (const target of allTargets) {
    const outputPath = path.join(publicDir, target.name);
    try {
      if (target.solidBg) {
        // Build premium app shortcut tile with official #002262 Dark Navy background and 72% logo size padding
        const logoSize = Math.round(target.size * 0.72);
        const logoResized = await sharp(svgPath)
          .resize(logoSize, logoSize)
          .png()
          .toBuffer();

        await sharp({
          create: {
            width: target.size,
            height: target.size,
            channels: 4,
            background: "#002262"
          }
        })
        .composite([{ input: logoResized, gravity: "centre" }])
        .png()
        .toFile(outputPath);
      } else {
        // Transparent standard browser favicon
        await sharp(svgPath)
          .resize(target.size, target.size)
          .png()
          .toFile(outputPath);
      }
      console.log(`CBBCL asset generated: ${target.name} (${target.size}x${target.size})`);
    } catch (err) {
      console.error(`Failed to generate CBBCL asset ${target.name}:`, err);
    }
  }

  // Generate robust PWA Site Webmanifest
  const manifestPath = path.join(publicDir, "site.webmanifest");
  const manifestContent = {
    name: "CBBCL",
    short_name: "CBBCL",
    description: "Cox's Bazar Boat Club Limited",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#111625",
    theme_color: "#9e7f46",
    icons: [
      {
        src: "/pwaicon-72x72.png",
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: "/pwaicon-96x96.png",
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: "/pwaicon-128x128.png",
        sizes: "128x128",
        type: "image/png"
      },
      {
        src: "/pwaicon-144x144.png",
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: "/pwaicon-152x152.png",
        sizes: "152x152",
        type: "image/png"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/pwaicon-384x384.png",
        sizes: "384x384",
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

