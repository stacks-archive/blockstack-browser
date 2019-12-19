const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  black: '#000000',
  white: '#ffffff',
  blue: Object.assign('#3700ff', {
    100: '#F2F2FF',
    200: '#E3E5FF',
    300: '#C5CCFF',
    400: '#AAB3FF',
    900: '#5548ff',
    hover: '#3100DC',
  }),
  ink: Object.assign('#0f1117', {
    50: '#f4f4f5',
    100: '#F9F9FC',
    150: '#F4F4F5',
    200: '#E7E7E8',
    250: '#C8C8CC',
    300: '#C8C8CC',
    400: '#A7A7AD',
    600: '#6E727D',
    900: '#27292E',
  }),
  darken: {
    50: 'rgba(15, 17, 23, 0.05)',
    100: 'rgba(15, 17, 23, 0.1)',
    150: 'rgba(15, 17, 23, 0.15)',
  },
  red: '#de0014',
  green: '#00a73e',
  orange: '#f7aa00',
  cyan: '#00d4ff',
  feedback: {},
};

colors.feedback = {
  error: colors.red,
  success: colors.green,
  warning: colors.orange,
  info: colors.cyan,
};

export default colors;
