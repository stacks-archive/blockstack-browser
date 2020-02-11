import React from 'react';

export const UnionLine = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="7" fill="none" viewBox="0 0 32 7">
    <mask id="a" width="32" height="7" x="0" y="0" fill="#000" maskUnits="userSpaceOnUse">
      <path fill="#fff" d="M0 0H32V7H0z"></path>
      <path
        fillRule="evenodd"
        d="M3.5 5a1.5 1.5 0 001.415-1h22.17a1.5 1.5 0 100-1H4.915A1.5 1.5 0 103.5 5z"
        clipRule="evenodd"
      ></path>
    </mask>
    <path
      fill="#677282"
      fillRule="evenodd"
      d="M3.5 5a1.5 1.5 0 001.415-1h22.17a1.5 1.5 0 100-1H4.915A1.5 1.5 0 103.5 5z"
      clipRule="evenodd"
    ></path>
    <path
      fill="#fff"
      d="M4.915 4V2H3.5L3.03 3.334 4.915 4zm22.17 0l1.886-.667L28.5 2h-1.415v2zm0-1v2H28.5l.471-1.333L27.085 3zM4.915 3l-1.886.666L3.5 5h1.415V3zm-1.886.334A.5.5 0 013.5 3v4a3.5 3.5 0 003.3-2.334L3.03 3.334zM27.085 2H4.915v4h22.17V2zM28.5 3a.5.5 0 01.471.333L25.2 4.667A3.5 3.5 0 0028.5 7V3zm-.5.5a.5.5 0 01.5-.5v4A3.5 3.5 0 0032 3.5h-4zm.5.5a.5.5 0 01-.5-.5h4A3.5 3.5 0 0028.5 0v4zm.471-.333A.5.5 0 0128.5 4V0a3.5 3.5 0 00-3.3 2.333l3.771 1.333zM4.915 5h22.17V1H4.915v4zM3.5 4a.5.5 0 01-.471-.334L6.8 2.334A3.5 3.5 0 003.5 0v4zm.5-.5a.5.5 0 01-.5.5V0A3.5 3.5 0 000 3.5h4zM3.5 3a.5.5 0 01.5.5H0A3.5 3.5 0 003.5 7V3z"
      mask="url(#a)"
    ></path>
  </svg>
);
