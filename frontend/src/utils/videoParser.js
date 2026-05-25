/**
 * Utility functions for parsing video URLs (YouTube & Google Drive)
 * to return embed URLs and thumbnails.
 */

export const parseVideoUrl = (url) => {
  if (!url) {
    return {
      embedUrl: '',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop',
      isYouTube: false,
      isDrive: false
    };
  }

  // 1. YouTube Shorts Parser
  const ytShortsRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
  const shortsMatch = url.match(ytShortsRegex);
  if (shortsMatch && shortsMatch[1]) {
    const videoId = shortsMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      isYouTube: true,
      isDrive: false
    };
  }

  // 2. YouTube Standard Video Parser
  const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      isYouTube: true,
      isDrive: false
    };
  }

  // 3. Google Drive Video Parser
  const driveRegex = /(?:https?:\/\/)?(?:drive\.google\.com)\/file\/d\/([a-zA-Z0-9_-]+)/;
  const driveMatch = url.match(driveRegex);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop', // Elegant stock image for GDrive
      isYouTube: false,
      isDrive: true
    };
  }

  // 4. Instagram Video Parser (Reels/Posts)
  const instaRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(reel|p)\/([a-zA-Z0-9_-]+)/;
  const instaMatch = url.match(instaRegex);
  if (instaMatch && instaMatch[2]) {
    const type = instaMatch[1]; // 'reel' or 'p'
    const id = instaMatch[2];
    return {
      embedUrl: `https://www.instagram.com/${type}/${id}/embed`,
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop', // Instagram themed stock image
      isYouTube: false,
      isDrive: false,
      isInstagram: true
    };
  }

  // Fallback
  return {
    embedUrl: url,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    isYouTube: false,
    isDrive: false,
    isInstagram: false
  };
};
