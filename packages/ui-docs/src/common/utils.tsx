import { BorderStyleProperty } from 'csstype';
import { ColorsStringLiteral } from '@components/color-modes';

export const slugify = (string: string) =>
  string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

/**
 * Style utils
 *
 * color={color('bg-alt')} // returns css var --var-colors-bg-alt
 * marginTop={space('extra-loose')} // maps to size in theme
 * border={border()} // default border
 */

enum NamedSpacing {
  ExtraTight = 'extra-tight',
  Tight = 'tight',
  BaseTight = 'base-tight',
  Base = 'base',
  BaseLoose = 'base-loose',
  Loose = 'loose',
  ExtraLoose = 'extra-loose',
}

type NamedSpacingLiteral =
  | 'none'
  | 'extra-tight'
  | 'tight'
  | 'base-tight'
  | 'base'
  | 'base-loose'
  | 'loose'
  | 'extra-loose';

type Spacing = NamedSpacingLiteral;

type SpacingTypes =
  | Spacing
  | [Spacing]
  | [Spacing, Spacing]
  | [Spacing, Spacing, Spacing]
  | [Spacing, Spacing, Spacing, Spacing];

export const space = (spacing: SpacingTypes): SpacingTypes => spacing;

export const color = (name: ColorsStringLiteral) => {
  return `var(--colors-${name})`;
};

export const border = (
  width = 1,
  style: BorderStyleProperty = 'solid',
  _color: ColorsStringLiteral = 'border'
): string => `${width}px ${style} ${color(_color)}`;
