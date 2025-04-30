/**
 * Path utility functions to handle basePath consistently across the application
 */

/**
 * Returns the path with the basePath prepended if in production environment
 * 
 * @param path The path to prepend the basePath to
 * @returns The path with the basePath prepended if in production
 */
export const getPath = (path: string): string => {
  const basePath = process.env.NODE_ENV === 'production' ? '/gallery-guess' : '';
  
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${basePath}${normalizedPath}`;
};

/**
 * Utility for handling Next.js Link hrefs with proper basePath
 * 
 * @param href The href for a Next.js Link component
 * @returns The href with correct basePath handling
 */
export const getLinkPath = (href: string): string => {
  // For Next.js Link components, we don't need to add basePath
  // as Next.js handles this automatically with the basePath config
  return href;
};