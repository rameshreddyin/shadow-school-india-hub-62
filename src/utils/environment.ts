
/**
 * Environment utility functions
 */

// Check if running in production mode
export const isProduction = (): boolean => {
  return import.meta.env.PROD === true;
};

// Log only in development
export const devLog = (message: string, ...args: any[]): void => {
  if (!isProduction()) {
    console.log(message, ...args);
  }
};

// Log warnings only in development
export const devWarn = (message: string, ...args: any[]): void => {
  if (!isProduction()) {
    console.warn(message, ...args);
  }
};

// Log errors in both environments, but with different levels of detail
export const logError = (error: unknown, context?: string): void => {
  if (isProduction()) {
    console.error(context ? `Error in ${context}` : 'An error occurred');
  } else {
    console.error(context ? `Error in ${context}:` : 'Error:', error);
  }
};
