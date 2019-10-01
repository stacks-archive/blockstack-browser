const topNavLinks = [
  "Getting started",
  "Patterns and Principles",
  "System props",
  "Responsive styles",
  "Theme"
];

const components = ["Box", "Button", "Flex", "Input", "PseudoBox", "Stack", "Text"];

const bottomNavLinks = [
  "Contributing",
  "Further reading",
  "Changelog",
  "GitHub"
];

const routes = [...topNavLinks, ...components, ...bottomNavLinks];

const links = {
  github: "https://github.com/blockstack/waffle-ui"
};
export { topNavLinks, components, bottomNavLinks, routes, links };
