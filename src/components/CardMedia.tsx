import React from "react";

interface CardMediaProps {
  media: string | undefined;
  alt?: string;
  className?: string;
}

export default function CardMedia({ media, alt = "", className = "" }: CardMediaProps) {
  if (!media) return null;

  const trimmed = media.trim();
  const isEmbed =
    trimmed.startsWith("<") ||
    trimmed.includes("<iframe") ||
    trimmed.includes("<div") ||
    trimmed.includes("<a") ||
    trimmed.includes("<svg") ||
    trimmed.includes("allowfullscreen") ||
    trimmed.includes("</iframe>");

  if (isEmbed) {
    // If it's a raw SVG, we can render it directly or wrap it nicely
    if (trimmed.startsWith("<svg") || trimmed.includes("</svg>")) {
      return (
        <span
          className={`inline-block ${className} overflow-hidden`}
          dangerouslySetInnerHTML={{ __html: media }}
        />
      );
    }

    // Checking if it's already a complete embed containing a wrapping div (e.g. Canva embeds)
    // Canva handles its own responsive ratio inside its wrapper.
    if (trimmed.startsWith("<div") && trimmed.includes("style=")) {
      return (
        <div 
          className="w-full h-full min-h-full min-w-full overflow-hidden relative flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: media }}
        />
      );
    }

    // For single iframe embeds (like standard YouTube or normal Google Maps),
    // we wrap them in a beautifully rounded, responsive aspect container.
    return (
      <div 
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "100%",
          overflow: "hidden",
          willChange: "transform"
        }}
        className="w-full h-full"
      >
        <div
          className="w-full h-full min-h-full min-w-full flex items-center justify-center [&_iframe]:absolute [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:top-0 [&_iframe]:left-0 [&_iframe]:border-none"
          dangerouslySetInnerHTML={{ __html: media }}
        />
      </div>
    );
  }

  // Fallback to standard img tag if it's a typical URL or base64 data-uri
  return (
    <img
      src={media}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
    />
  );
}
