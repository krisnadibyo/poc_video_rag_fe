export function extractVideoId(url: string): string {
  // Handle different YouTube URL formats
  const regexPatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]

  for (const pattern of regexPatterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  throw new Error("Invalid YouTube URL")
}

export function getYouTubeThumbnail(videoId: string): string {
  // Return the high-quality thumbnail URL
  const url = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  console.log("url", url)
  return url
}

