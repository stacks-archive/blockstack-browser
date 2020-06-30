import React from 'react';
import { Box, color, space, useSafeLayoutEffect } from '@blockstack/ui';
import { slugify } from '@common/utils';
import { Text } from '@components/typography';
import { Link } from '@components/mdx';
import { useActiveHeading } from '@common/hooks/use-active-heading';

const Item = ({ slug, label }) => {
  const { isActive: _isActive, doChangeActiveSlug, slugInView } = useActiveHeading(slug);
  const isOnScreen = slugInView === slug;

  const isActive = isOnScreen || _isActive;
  return (
    <Box py={space('extra-tight')}>
      <Link
        href={`#${slug}`}
        fontSize="14px"
        color={isActive ? color('text-title') : color('text-caption')}
        fontWeight={isActive ? '600' : '400'}
        onClick={() => doChangeActiveSlug(slug)}
        textDecoration="none"
        _hover={{
          textDecoration: 'underline',
          color: color('accent'),
        }}
        pointerEvents={isActive ? 'none' : 'unset'}
      >
        {label}
      </Link>
    </Box>
  );
};

export const TableOfContents = ({ headings }: { headings?: string[] }) => {
  return (
    <Box position="relative">
      <Box
        mt="50px"
        flexShrink={0}
        display={['none', 'none', 'block', 'block']}
        minWidth={['100%', '200px', '200px']}
        position="sticky"
        top="118px"
      >
        <Box mb={space('extra-tight')}>
          <Text fontWeight="bold" fontSize="14px">
            On this page
          </Text>
        </Box>
        {headings.map((heading, index) => {
          return index > 0 ? <Item slug={slugify(heading)} label={heading} key={index} /> : null;
        })}
      </Box>
    </Box>
  );
};
