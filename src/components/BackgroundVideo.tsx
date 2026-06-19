import React, { useEffect, useRef } from "react";

interface BackgroundVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function BackgroundVideo({
  src,
  poster,
  className = "absolute inset-0 w-full h-full object-cover transition-all duration-500",
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM manipulation ensures these attributes are fully enforced
    // which bypasses strict iOS/Chrome WebKit autoplay constraints.
    video.muted = true;
    video.defaultMuted = true;
    
    // Attempt playback immediately
    const startPlayback = () => {
      video.play().catch((err) => {
        console.warn("Browser autoplay blocked of background video, preparing user interaction triggers:", err);
      });
    };

    startPlayback();

    // Responsive interaction trigger as a safe fallback for aggressive autoplay restrictions:
    // Some mobile browsers block initial autoplay if the device is in low-power mode,
    // but we can wake it up silently upon any scroll, touch, or click.
    const wakeUpVideo = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
      // Cleanup once playback has successfully initiated or tried
      removeWakeUpListeners();
    };

    const removeWakeUpListeners = () => {
      document.removeEventListener("touchstart", wakeUpVideo);
      document.removeEventListener("click", wakeUpVideo);
      document.removeEventListener("scroll", wakeUpVideo);
    };

    document.addEventListener("touchstart", wakeUpVideo, { passive: true });
    document.addEventListener("click", wakeUpVideo, { passive: true });
    // Scroll event can trigger autoplay once viewport changes
    document.addEventListener("scroll", wakeUpVideo, { passive: true });

    return () => {
      removeWakeUpListeners();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  );
}
