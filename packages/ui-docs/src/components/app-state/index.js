import React from "react";
import { useRouter } from "next/router";

const initialState = {
  mobileMenu: false,
  activeSlug: ""
};
const AppStateContext = React.createContext(initialState);

const useAppState = () => React.useContext(AppStateContext);

const selectMobileMenuState = () => {
  const state = useAppState();
  return state.mobileMenu;
};

const useMobileMenuState = () => {
  const { setState } = useAppState();
  const isOpen = selectMobileMenuState();
  const handleToggle = React.useCallback(
    () => setState(s => ({ ...s, mobileMenu: !s.mobileMenu })),
    [isOpen]
  );
  const handleClose = React.useCallback(
    () => isOpen && setState(s => ({ ...s, mobileMenu: false })),
    [isOpen]
  );
  const handleOpen = React.useCallback(
    () => !isOpen && setState(s => ({ ...s, mobileMenu: true })),
    [isOpen]
  );
  return {
    isOpen,
    setOpen: setState,
    handleToggle,
    handleClose,
    handleOpen
  };
};

const useActiveHeading = ({ slug }) => {
  const router = useRouter();
  const { setState, ...state } = useAppState();
  const { asPath } = router;

  React.useEffect(() => {
    if (
      asPath &&
      asPath.includes("#") &&
      asPath.split("#")[1] === slug &&
      state.activeSlug !== slug
    ) {
      setState(s => ({ ...s, activeSlug: slug }));
    }
    if (asPath && !asPath.includes("#")) {
      setState(s => ({ ...s, activeSlug: "" }));
    }
  }, [asPath]);

  const handleStateUpdate = React.useCallback(
    newSlug => setState(s => ({ ...s, activeSlug: newSlug })),
    [state.activeSlug]
  );

  const selectActiveSlug = state => state && state.activeSlug;

  const isActive = selectActiveSlug(state) === slug;

  return [isActive, handleStateUpdate];
};

const AppStateProvider = props => {
  const [state, setState] = React.useState(initialState);

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        setState
      }}
      {...props}
    />
  );
};

export {
  AppStateProvider,
  AppStateContext,
  useAppState,
  selectMobileMenuState,
  useMobileMenuState,
  useActiveHeading
};
