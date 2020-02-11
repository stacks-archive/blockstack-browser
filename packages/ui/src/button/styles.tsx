import { ButtonModes, ButtonSizes, CustomStyles, IButtonStyles } from '../button';

const baseProps = {
  display: 'inline-flex',
  appearance: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 250ms',
  userSelect: 'none',
  position: 'relative',
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  lineHeight: 'shorter',
  outline: 'none',
  border: '1px solid',
  borderColor: 'transparent',
};

const sizes = {
  lg: {
    height: 12,
    minWidth: 9 * 14,
    fontSize: '14px',
    px: 5,
  },
  md: {
    height: 10,
    minWidth: 10,
    fontSize: '14px',
    px: 4,
  }
};

const unstyledStyle = {
  userSelect: 'inherit',
  bg: 'none',
  border: 0,
  color: 'inherit',
  display: 'inline',
  font: 'inherit',
  lineHeight: 'inherit',
  m: 0,
  p: 0,
  textAlign: 'inherit',
};

const linkVariantProps = () => {
  return {
    p: 0,
    height: 'unset',
    lineHeight: 'normal',
    color: 'blue',
    minWidth: 'unset',
    _hover: {
      color: 'blue.hover',
      textDecoration: 'underline',
    },
    _active: {
      textDecoration: 'underline',
    },
    _focus: {
      textDecoration: 'underline',
    },
    _disabled: {
      color: '#A7A7AD',
    },
  };
};

const solidVariantProps = ({ mode, customStyles }: { mode: ButtonModes; customStyles: CustomStyles }) => {
  const style = {
    primary: {
      bg: 'blue',
      color: 'white',
      _hover: {
        cursor: 'pointer',
      },
      _focus: {
        borderColor: 'blue.300',
        boxShadow: '0 0 0 3px rgba(170, 179, 255, 0.75)',
      },
      _disabled: {
        bg: 'blue.200',
        cursor: 'not-allowed',
      },
    },
    secondary: {
      bg: 'blue.100',
      color: 'blue',
      _hover: {
        cursor: 'pointer',
      },
      _focus: {
        borderColor: 'blue.300',
        boxShadow: '0 0 0 3px rgba(170, 179, 255, 0.75)',
      },
      _disabled: {
        bg: 'blue.100',
        pointerEvents: 'none',
        cursor: 'not-allowed',
        color: 'blue.300',
      },
    },
  };

  if (customStyles) {
    return customStyles[mode];
  }

  return style[mode];
};

const sizeProps = ({ size }: { size: ButtonSizes }) => sizes[size];

const variantProps = (props: any) => {
  switch (props.variant) {
    case 'solid':
      return solidVariantProps(props);
    case 'link':
      return linkVariantProps();
    case 'unstyled':
      return unstyledStyle;
    default:
      return {};
  }
};

const useButtonStyle = (props: IButtonStyles): any => ({
  ...baseProps,
  ...variantProps(props),
  ...sizeProps(props),
});

export { useButtonStyle };
