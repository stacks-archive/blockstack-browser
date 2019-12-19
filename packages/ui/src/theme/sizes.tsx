const containers = {
  'screen-sm': '640px',
  'screen-md': '768px',
  'screen-lg': '1024px',
  'screen-xl': '1280px',
};

export const baseSizes = {
  '0': '0',
  px: '1px',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem',
};

//
// export const baseSizes = {
//   "0": "0px",
//   px: "1px",
//   "1": "4px",
//   "2": "8px",
//   "3": "12px",
//   "4": "16px",
//   "5": "20px",
//   "6": "24px",
//   "8": "32px",
//   "10": "40px",
//   "12": "48px",
//   "16": "64px",
//   "20": "80px",
//   "24": "96px",
//   "32": "128px",
//   "40": "160px",
//   "48": "192px",
//   "56": "224px",
//   "64": "256px",
// };

const sizes = {
  ...baseSizes,
  containers,
};

export default sizes;
