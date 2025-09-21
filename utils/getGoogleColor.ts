// Returns a Google-style color based on the user's email address or name
const GOOGLE_COLORS = [
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#009688', // Teal
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#FF5722', // Deep Orange
  '#795548', // Brown
]

export function getGoogleColor(seed: string = ""): string {
  if (!seed) return GOOGLE_COLORS[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % GOOGLE_COLORS.length
  return GOOGLE_COLORS[idx]
} 