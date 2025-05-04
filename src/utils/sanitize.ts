
/**
 * Utility functions for sanitizing user input
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes a string to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
};

/**
 * Sanitizes HTML content allowing specific HTML tags
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};

/**
 * Sanitizes a number value
 * @param value Number or string value to sanitize
 * @returns Sanitized number or 0 if invalid
 */
export const sanitizeNumber = (value: number | string): number => {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

/**
 * Sanitizes form data by running sanitizeString on all string values
 * @param data Form data object
 * @returns Sanitized form data object
 */
export const sanitizeFormData = <T extends Record<string, unknown>>(data: T): T => {
  const sanitized = { ...data } as Record<string, unknown>;
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeFormData(value as Record<string, unknown>);
    }
  });
  
  return sanitized as T;
};

/**
 * Escapes a string for use in a regular expression
 * @param string String to escape
 * @returns Escaped string safe for use in RegExp
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Creates slug from a string (URL-friendly version)
 * @param text Text to convert to slug
 * @returns URL-friendly slug
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Add DOMPurify to window event listeners to handle dynamic content
if (typeof window !== 'undefined') {
  DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    // Add target=_blank to all external links
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
}
