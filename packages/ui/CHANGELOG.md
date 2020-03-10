# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.39](https://github.com/blockstackpbc/blockstack-ui/compare/@blockstack/ui@1.0.0-alpha.38...@blockstack/ui@1.0.0-alpha.39) (2020-03-10)


### Bug Fixes

* proper typings location in package.json ([b04a009](https://github.com/blockstackpbc/blockstack-ui/commit/b04a009fe4da9eed8973d87297c677d2e1ce1687))





# 1.0.0-alpha.38 (2020-03-10)


### Bug Fixes

* adjust root dir so packages can build correctly ([f99c210](https://github.com/blockstackpbc/blockstack-ui/commit/f99c2109a0068250e0983c65a4c5a4e713ddc0e7))
* Buttons ([#29](https://github.com/blockstackpbc/blockstack-ui/issues/29)) ([a7e12ce](https://github.com/blockstackpbc/blockstack-ui/commit/a7e12cec949e21e033a6006d8d9be902fda03562))
* Change default modal size, Fixes blockstack/blockstack-app[#77](https://github.com/blockstackpbc/blockstack-ui/issues/77) ([86a43f8](https://github.com/blockstackpbc/blockstack-ui/commit/86a43f898a5f6cbd354e1c6a7fa03e4d989a527c))
* Missing 'deg' from chevron transform property ([584f186](https://github.com/blockstackpbc/blockstack-ui/commit/584f186e1cd4f387e70cbba412a2d520ea4799fd))
* Modal going off-canvas on mobile, Closes blockstack/app[#190](https://github.com/blockstackpbc/blockstack-ui/issues/190) ([1c64d9c](https://github.com/blockstackpbc/blockstack-ui/commit/1c64d9c395d2586423832c593d271886ddbed3be))


### Features

* Add a ChevronIcon ([#30](https://github.com/blockstackpbc/blockstack-ui/issues/30)) ([2f929b1](https://github.com/blockstackpbc/blockstack-ui/commit/2f929b10ba6a77ff33ebe8e87fb14283153809d9))
* add CI, proper connections between packages ([5934829](https://github.com/blockstackpbc/blockstack-ui/commit/5934829a40338ac269b80783912c8dad17af1962))





# Changelog

## 1.0.0-alpha.37

- Updates modal to fix some regressions
- Added `ScopedCSSReset` component to wrap around things that need certain resets, such as @blockstack/connect.

## 1.0.0-alpha.35

- Fix modal

## 1.0.0-alpha.34

- Fixes ChevronIcon

## 1.0.0-alpha.32

- Fixes modal width.
- Updates button secondary style to match designs.
- Forces typesize on button text.

## 1.0.0-alpha.28

- Add `ChevronIcon` component, update `Button`s to align with styleguide.

## 1.0.0-alpha.25

- Add `displayName` attr to all components that use forwarRef.
- Add `textTransform` prop to base BoxProps.

## 1.0.0-alpha.24

- Update layout for button to center elements.

## 1.0.0-alpha.23

- Remove padding on modal content component.

## 1.0.0-alpha.22

- Implement and export `Modal` component.

## 1.0.0-alpha.21

- Format library with `@blockstack/prettier-config` and enforce with CircleCI.

## 1.0.0-alpha.20

- Export more from the library, including types.

## 1.0.0-alpha.19

- Update input border colors.

## 1.0.0-alpha.18

- Update theme default border color.

## 1.0.0-alpha.17

- Fixed bug with `<Stack>` where it would render null children and mess up the `isLastChild` check.

## 1.0.0-alpha.16

- Export `<Spinner>` component.

## 1.0.0-alpha.14

- Added textDecoration typings

## 1.0.0-alpha.12

- Updated our colors based off of the design system.
- Added more specific types for boxShadow to reflect our values in the theme.

## 1.0.0-alpha.11

- `transition` style typing added to `<Box>`
- Added transition prop to hover element on buttons to animate it smoothly.

## 1.0.0-alpha.10

- Added hover element in buttons to automatically add in the dark layer on hover.

## 1.0.0-alpha.9

- Added ability to pass `customStyles` prop to buttons to change their styling

## 1.0.0-alpha.8

- Updated tsconfig.js based off of [Formik's](https://github.com/jaredpalmer/formik/blob/master/tsconfig.base.json)
- removed any empty returns

## 1.0.0-alpha.7

- Updated variantColor typings on `Button` and `ButtonGroup`.

## 1.0.0-alpha.6

- Added `transform` typings to `Box`.

## 1.0.0-alpha.5

- Fixed typings for `<Text>` component.
