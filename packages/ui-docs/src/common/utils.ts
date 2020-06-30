import { Children, isValidElement, ReactNode, ReactElement, ReactText } from 'react';

import { BorderStyleProperty } from 'csstype';
import { color } from '@blockstack/ui';
import { ColorsStringLiteral } from '@blockstack/ui';

const camelToKebab = (string: string) =>
  string
    .toString()
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase();

export const slugify = (string: string) =>
  string
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

export const border = (
  width = 1,
  style: BorderStyleProperty = 'solid',
  _color: ColorsStringLiteral = 'border'
): string => `${width}px ${style} ${color(_color)}`;

// https://github.com/fernandopasik/react-children-utilities/blob/master/src/lib/hasChildren.ts
const hasChildren = (element: ReactNode): element is ReactElement<{ children: ReactNode[] }> =>
  isValidElement<{ children?: ReactNode[] }>(element) && Boolean(element.props.children);

// https://github.com/fernandopasik/react-children-utilities/blob/master/src/lib/onlyText.ts
export const childToString = (child?: ReactText | boolean | {} | null): string => {
  if (typeof child === 'undefined' || child === null || typeof child === 'boolean') {
    return '';
  }

  if (JSON.stringify(child) === '{}') {
    return '';
  }

  return (child as string | number).toString();
};

export const onlyText = (children: ReactNode): string => {
  if (!(children instanceof Array) && !isValidElement(children)) {
    return childToString(children);
  }

  return Children.toArray(children).reduce((text: string, child: ReactNode): string => {
    let newText = '';

    if (isValidElement(child) && hasChildren(child)) {
      newText = onlyText(child.props.children);
    } else if (isValidElement(child) && !hasChildren(child)) {
      newText = '';
    } else {
      newText = childToString(child);
    }

    return text.concat(newText);
  }, '') as string;
};
