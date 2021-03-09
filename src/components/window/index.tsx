/**
 * This doesnt work quite right yet. It opens a new window, but has nothing from next.js. It's all by itself, with no next.js code.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, theme } from '@stacks/ui';

const PortalContainer: React.FC = props => {
  return (
    <>
      <ThemeProvider theme={theme}>
        {/*<CSSReset />*/}
        {props.children}
      </ThemeProvider>
    </>
  );
};

interface WindowState {
  win: Window | null;
  el: HTMLDivElement | null;
}

interface WindowProps {
  children: React.ReactChildren;
}

const Window = ({ children }: WindowProps) => {
  const [state, setState] = React.useState<WindowState>({
    win: null,
    el: null,
  });

  React.useEffect(() => {
    const win = window.open('', '', 'width=440,height=584,left=200,top=200') as Window;
    win.document.title = 'Continue with Secret Key';
    const el = document.createElement('div');
    win.document.body.appendChild(el);
    setState({ win, el });

    return () => state.win?.close();
  }, []);

  if (!state.el) {
    return null;
  } else {
    return ReactDOM.createPortal(<PortalContainer>{children}</PortalContainer>, state.el);
  }
};

export { Window };
