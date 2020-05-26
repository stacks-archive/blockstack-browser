import { Box, Flex } from '@blockstack/ui';
import { Caption, Text } from '@components/typography';
import { useRouter } from 'next/router';
import React from 'react';
import { routes } from '@common/routes';
import { slugify, space } from '@common/utils';
import Link from 'next/link';
import { useHover } from 'use-events';
import { ContentWrapper } from '@components/content-wrapper';
import { color } from '@components/color-modes';

const transition = 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)';

const Previous = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <Flex>
      <Box
        mr="extra-tight"
        transition={transition}
        transform={isHovered ? 'translateX(-2px)' : 'none'}
      >
        ←
      </Box>
      <Box>
        <Caption>Previous</Caption>
      </Box>
    </Flex>
  );
};
const Next = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <Flex>
      <Box>
        <Caption>Next</Caption>
      </Box>
      <Box
        ml="extra-tight"
        transition={transition}
        transform={isHovered ? 'translateX(2px)' : 'none'}
      >
        →
      </Box>
    </Flex>
  );
};

interface PaginationLinkProps {
  slug: string;
  label: string;
  prev?: boolean;
}

const PaginationLink = ({ slug, label, prev }: PaginationLinkProps) => {
  const [isHovered, bindHover] = useHover();
  return (
    <Link href={`/${slug}`} passHref>
      <Box
        color="var(--colors-text-body)"
        _hover={{
          color: 'var(--colors-accent)',
        }}
        as="a"
        textAlign="left"
        py={space('extra-loose')}
        display="block"
        {...bindHover}
      >
        <Caption display="block">
          {prev ? <Previous isHovered={isHovered} /> : <Next isHovered={isHovered} />}
        </Caption>
        <Text display="block" textStyle="display.large" color="currentColor">
          {label}
        </Text>
      </Box>
    </Link>
  );
};
const Pagination = () => {
  const router = useRouter();
  const routesAsSlugs = routes.map(r => slugify(r));
  const _route = router.asPath.replace('/', '');
  const section = _route.includes('/') ? _route.split('/')[0] : undefined;
  const __route = _route.includes('/') ? _route.split('/')[1] : _route;
  const route = __route === '' ? 'getting-started' : __route;
  const index = routesAsSlugs.indexOf(route);
  const previous = routes[index - 1];
  const previousSlug = section
    ? section + '/' + routesAsSlugs[index - 1]
    : routesAsSlugs[index - 1];
  const next = routes[index + 1];
  const nextSlug = section ? section + '/' + routesAsSlugs[index + 1] : routesAsSlugs[index + 1];
  return (
    <ContentWrapper
      borderTop="1px solid"
      borderColor={color('border')}
      flexDirection="row"
      alignItems="baseline"
      justify="space-between"
      pt="unset"
      pb="unset"
    >
      {previous && (
        <Box textAlign="left">
          <PaginationLink slug={previousSlug} label={previous} prev />
        </Box>
      )}
      {next && (
        <Box textAlign="right" ml={!previous ? 'auto' : undefined}>
          <PaginationLink slug={nextSlug} label={next} />
        </Box>
      )}
    </ContentWrapper>
  );
};

export { Pagination };
