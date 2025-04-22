import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const FITNESS_IMAGE_CATEGORIES = [
  "fitness",
  "workout",
  "gym",
  "yoga",
  "running",
  "meditation",
  "nutrition",
  "healthy-food"
]

/**
 * Generate a realistic image URL for fitness-related content
 * @param seed Unique identifier for consistent image generation
 * @param width Image width
 * @param height Image height
 * @param category Optional category to specify image type
 * @returns URL to a high-quality fitness image
 */
export function generateFitnessImage(
  seed: string | number, 
  width: number = 600, 
  height: number = 400, 
  category?: string
): string {
  // Use a deterministic seed for consistent images
  const seedStr = typeof seed === 'number' ? `${seed}` : seed
  const seedHash = hashString(seedStr) % 100
  
  // Select category based on seed if not provided
  const selectedCategory = category || 
    FITNESS_IMAGE_CATEGORIES[seedHash % FITNESS_IMAGE_CATEGORIES.length]
  
  // Use Unsplash API with seed and category
  return `https://source.unsplash.com/featured/${width}x${height}/?${selectedCategory}&sig=${seedHash}`
}

/**
 * Generate a profile avatar URL
 * @param username Username or user ID
 * @param size Size of the avatar (width and height)
 * @returns URL to a consistent avatar
 */
export function generateAvatar(username: string, size: number = 200): string {
  // Sanitize username to ensure valid URL
  const sanitizedUsername = encodeURIComponent(username)
  
  // Use dicebear API with modern style
  return `https://api.dicebear.com/7.x/personas/svg?seed=${sanitizedUsername}&size=${size}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

/**
 * Simple hash function for strings
 * @param str String to hash
 * @returns Numeric hash value
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}
