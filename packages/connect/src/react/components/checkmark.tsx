import React from 'react';

export const CheckmarkIcon = ({ size = 72 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 72 72">
    <circle cx="36" cy="36" r="34.5" fill="#fff" stroke="#00A73E" strokeWidth="3"></circle>
    <path stroke="#00A73E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 37l10 10 20-22"></path>
  </svg>
);
