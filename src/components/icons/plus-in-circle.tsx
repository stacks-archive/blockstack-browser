import React from 'react';

export const PlusInCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#C1C3CC"></circle>
    <g clipPath="url(#clip0)">
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M8.36 11.25a.75.75 0 000 1.5h3.375v3.376a.75.75 0 001.5 0V12.75h3.377a.75.75 0 000-1.5h-3.376V7.874a.75.75 0 10-1.5 0v3.376H8.358z"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill="#fff" d="M4 12H16V24H4z" transform="rotate(-45 4 12)"></path>
      </clipPath>
    </defs>
  </svg>
);
