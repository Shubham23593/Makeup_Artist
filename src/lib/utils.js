import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Optimize a Cloudinary image URL by injecting quality/format transformations.
 * Reduces image size by 40-70% without visible quality loss.
 * Returns the original URL unchanged if it's not a Cloudinary URL.
 */
export function optimizeImage(url, width) {
    if (!url || !url.includes("cloudinary.com")) return url;
    // Insert transformations before /upload/ path
    const transforms = `f_auto,q_auto${width ? `,w_${width}` : ""}`;
    return url.replace("/upload/", `/upload/${transforms}/`);
}
