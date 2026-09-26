import React from 'react';

interface LandingContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LandingContainer: React.FC<LandingContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 md:px-8 ${className}`}>
      {children}
    </div>
  );
};

export default LandingContainer;