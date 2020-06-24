export const topNavLinks = [
  'Getting started',
  'Patterns and Principles',
  'System props',
  'Responsive styles',
  'Theme',
];

export const components = [
  'Box',
  'Button',
  'CodeBlock',
  'Color modes',
  'CSS Reset',
  'Flex',
  'Grid',
  'Highlighter',
  'Icons',
  'Input',
  'Modal',
  'Popper',
  'Portal',
  'Spinner',
  'Stack',
  'Text',
  'Theme Provider',
  'Tooltip',
  'Transition',
];

export const hooks = [
  'useControllable',
  'useDisclosure',
  'useEventListener',
  'useForceUpdate',
  'useId',
  'useLatestRef',
  'useMergeRefs',
  'useTheme',
];

export const bottomNavLinks = ['Contributing', 'Further reading'];

export const routes = [...topNavLinks, ...components, ...hooks, ...bottomNavLinks];

export const paginationRoutes = {
  top: topNavLinks,
  components,
  hooks,
  bottom: bottomNavLinks,
};

export const links = {
  github: 'https://github.com/blockstack/ux',
};
