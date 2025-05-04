
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the viewport is mobile-sized
 * @param breakpoint - The breakpoint in pixels (default: 768)
 * @returns Boolean indicating if the viewport is mobile-sized
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    window.addEventListener('resize', checkSize);
    
    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, [breakpoint]);

  return isMobile;
};
