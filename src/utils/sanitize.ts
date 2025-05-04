
/**
 * Input sanitization utilities to prevent XSS attacks
 */

// Sanitize text input
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#x60;')
    .replace(/\//g, '&#x2F;');
};

// Sanitize object by recursively sanitizing all string fields
export const sanitizeObject = <T>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = Array.isArray(obj) ? [...obj] : { ...obj };
  
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    if (typeof value === 'string') {
      result[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    }
  });
  
  return result as T;
};

// Form input sanitizer for React forms
export const sanitizeFormData = <T extends Record<string, unknown>>(formData: T): T => {
  const sanitized = { ...formData };
  
  Object.entries(sanitized).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value) as unknown;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value) as unknown;
    }
  });
  
  return sanitized;
};
