const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function getOptimizedUrl(src: string, width = 600): string {
  if (!src) return "";

  if (src.startsWith("/")) {
    return src;
  }

  if (src.startsWith("http://") || src.startsWith("https://")) {
    if (!src.includes("cloudinary.com")) return src;
    return src.replace("/upload/", `/upload/w_${width},f_auto,q_auto/`);
  }

  if (!cloudName) return `/${src}`;

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},f_auto,q_auto/${src}`;
}
