const defaultStyle = {
  height: 12,
  border: '1px solid',
  borderBottomColor: 'inherit',
  borderLeftColor: 'inherit',
  borderRightColor: 'inherit',
  borderTopColor: 'inherit',
  borderColor: 'inherit',
  bg: 'white',
  _hover: {
    borderBottomColor: 'ink.300',
    borderLeftColor: 'ink.300',
    borderRightColor: 'ink.300',
    borderTopColor: 'ink.300',
    borderColor: 'ink.300',
  },
  _disabled: {
    bg: '#f9f9fc',
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  _focus: {
    borderBottomColor: 'blue.300',
    borderLeftColor: 'blue.300',
    borderRightColor: 'blue.300',
    borderTopColor: 'blue.300',
    borderColor: 'blue.300',
    boxShadow: '0 0 0 1px rgba(170, 179, 255, 0.75)',
  },
  _invalid: {
    borderBottomColor: 'red',
    borderLeftColor: 'red',
    borderRightColor: 'red',
    borderTopColor: 'red',
    borderColor: 'red',
  },
};

const baseProps = {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  transition: 'all 0.2s',
  outline: 'none',
  borderRadius: '6px',
  p: '14px 16px',
};

interface InputStyle {
  [key: string]: any;
}
interface InputStyles {
  default: InputStyle;
  [key: string]: InputStyle;
}

export const inputSizes: InputStyles = {
  default: {
    fontSize: 'body.small',
    height: '12', // 48px
    lineHeight: 'base',
  },
};

const useInputStyle = (props: any) => {
  return {
    width: props.isFullWidth ? '100%' : undefined,
    ...baseProps,
    ...defaultStyle,
  };
};

export default useInputStyle;
