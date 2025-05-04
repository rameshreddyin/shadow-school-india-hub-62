
import React, { ReactNode } from 'react';

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

/**
 * A wrapper component that makes tables responsive by adding horizontal scrolling on small screens
 */
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-auto scrollbar-thin ${className}`} role="region" aria-label="Scrollable table">
      {children}
    </div>
  );
};

export default ResponsiveTable;
