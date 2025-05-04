
/**
 * Security utilities for the application
 */

/**
 * Sanitizes a string to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  
  // Create a temporary DOM element
  const doc = new DOMParser().parseFromString('', 'text/html');
  const tempEl = doc.createElement('div');
  tempEl.textContent = input;
  
  // Return the sanitized content
  return tempEl.innerHTML;
};

/**
 * Validates an email address format
 * @param email Email to validate
 * @returns True if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Checks password strength
 * @param password Password to check
 * @returns Object with strength score and feedback
 */
export const checkPasswordStrength = (password: string): { 
  score: number; 
  feedback: string;
} => {
  if (!password) {
    return { score: 0, feedback: 'Password is required' };
  }
  
  let score = 0;
  let feedback = '';
  
  // Length check
  if (password.length < 8) {
    feedback = 'Password should be at least 8 characters';
  } else {
    score += 1;
  }
  
  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  }
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  }
  
  // Contains numbers
  if (/\d/.test(password)) {
    score += 1;
  }
  
  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }
  
  // Provide feedback based on score
  if (score < 3) {
    feedback = 'Weak password. Add uppercase, numbers, or special characters.';
  } else if (score < 5) {
    feedback = 'Medium strength. Could be stronger.';
  } else {
    feedback = 'Strong password!';
  }
  
  return { score, feedback };
};

/**
 * Prevents clickjacking by setting the appropriate headers
 * This would typically be used on the server but is included for reference
 */
export const preventClickjacking = (): void => {
  if (typeof window !== 'undefined') {
    // This is just for documentation - in practice these headers
    // would be set on the server side
    console.info('X-Frame-Options: DENY');
    console.info('Content-Security-Policy: frame-ancestors \'none\'');
  }
};

/**
 * Validates a file is safe to upload based on extension and MIME type
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 * @returns True if safe, false otherwise
 */
export const isSafeFile = (
  file: File, 
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
): boolean => {
  // Check file extension
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  // Check MIME type
  const hasValidMimeType = allowedTypes.includes(file.type);
  
  return hasValidExtension && hasValidMimeType;
};

/**
 * Encodes a value for including in a URL query parameter
 * @param value Value to encode
 * @returns Encoded value
 */
export const encodeQueryParam = (value: string): string => {
  return encodeURIComponent(value);
};

/**
 * Decodes a value from a URL query parameter
 * @param value Value to decode
 * @returns Decoded value
 */
export const decodeQueryParam = (value: string): string => {
  return decodeURIComponent(value);
};
