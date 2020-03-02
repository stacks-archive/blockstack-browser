const containers = {
  'screen-sm': '640px',
  'screen-md': '768px',
  'screen-lg': '1024px',
  'screen-xl': '1280px',
};

export const baseSizes = {
  '0': '0px',
  px: '1px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
  '32': '128px',
  '40': '160px',
  '48': '192px',
  '56': '224px',
  '64': '256px',
};

export const namedSpacingUnits = {
  none: baseSizes[0], //0px
  'extra-tight': baseSizes[1], //4px
  tight: baseSizes[2], //8px
  'base-tight': baseSizes[3], //12px
  base: baseSizes[4], //16px
  'base-loose': baseSizes[5], //20px
  loose: baseSizes[6], //24px
  'extra-loose': baseSizes[8], //32px
};

export const sizes = {
  ...baseSizes,
  containers,
  ...namedSpacingUnits,
};
