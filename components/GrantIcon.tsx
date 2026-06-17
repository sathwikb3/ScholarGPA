
import React from 'react';

interface GrantIconProps {
  size?: number;
  className?: string;
}

const GrantIcon: React.FC<GrantIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Mortarboard top - slightly tilted for "character" */}
      <path 
        d="M2 8L12 3L22 8L12 13L2Z" 
        fill="currentColor" 
        fillOpacity="0.2" 
      />
      
      {/* Cap base - rounded for cartoon feel */}
      <path 
        d="M6 10V16C6 17.5 8.5 18.5 12 18.5C15.5 18.5 18 17.5 18 16V10" 
        fill="currentColor" 
        fillOpacity="0.1" 
      />
      
      {/* Tassel - thick and playful */}
      <path d="M22 8V14" strokeWidth="2.5" />
      <circle cx="22" cy="15" r="1" fill="currentColor" stroke="none" />
      
      {/* The Smiley Face! */}
      {/* Eyes */}
      <circle cx="10" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="13.5" r="1" fill="currentColor" stroke="none" />
      
      {/* Smile */}
      <path 
        d="M9.5 15.5C10.5 16.8 13.5 16.8 14.5 15.5" 
        stroke="currentColor" 
        strokeWidth="1.5" 
      />
    </svg>
  );
};

export default GrantIcon;
