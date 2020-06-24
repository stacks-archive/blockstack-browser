import { Box, Flex, FlexProps, color, space, BoxProps } from '@blockstack/ui';
import { Caption, Text } from '@components/typography';
import { useRouter } from 'next/router';
import React from 'react';
import { routes, paginationRoutes } from '@common/routes';
import { slugify } from '@common/utils';
import Link from 'next/link';
import { useHover } from 'use-events';
import { ContentWrapper } from '@components/content-wrapper';

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
    <Flex justifyContent="flex-end">
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

interface PaginationLinkProps extends BoxProps {
  slug: string;
  label: string;
  prev?: boolean;
}

const PaginationLink = ({ slug, label, prev, ...rest }: PaginationLinkProps) => {
  const [isHovered, bindHover] = useHover();
  return (
    <Link href={`/${slug}`} passHref>
      <Box
        color="var(--colors-text-body)"
        _hover={{
          color: 'var(--colors-accent)',
        }}
        as="a"
        py={space('extra-loose')}
        display="block"
        flexGrow={1}
        {...bindHover}
        {...rest}
      >
        <Caption textAlign={prev ? 'left' : 'right'} display="block">
          {prev ? <Previous isHovered={isHovered} /> : <Next isHovered={isHovered} />}
        </Caption>
        <Text
          textAlign={prev ? 'left' : 'right'}
          display="block"
          textStyle="display.large"
          color="currentColor"
        >
          {label}
        </Text>
      </Box>
    </Link>
  );
};

const getRouteWithSection = (route: string) => {
  let section = '';
  const keys = Object.keys(paginationRoutes);
  keys.forEach(key => {
    const routes = paginationRoutes[key].map(r => slugify(r));
    if (routes.length && routes.find(r => r === route) && key !== 'top' && key !== 'bottom') {
      section = key + '/';
    }
  });
  return section + route;
};

const usePagination = () => {
  const router = useRouter();
  const [state, setState] = React.useState({
    previous: undefined,
    previousSlug: undefined,
    next: undefined,
    nextSlug: undefined,
  });
  React.useEffect(() => {
    const routesAsSlugs = routes.map(r => slugify(r));
    const _route = router.asPath.replace('/', '');
    const __route = _route.includes('/') ? _route.split('/')[1] : _route;
    const route = __route === '' ? 'getting-started' : __route;
    const index = routesAsSlugs.indexOf(route);
    const previous = routes[index - 1];
    const previousSlug = getRouteWithSection(routesAsSlugs[index - 1]);
    const next = routes[index + 1];
    const nextSlug = getRouteWithSection(routesAsSlugs[index + 1]);

    setState({
      previous,
      previousSlug,
      next,
      nextSlug,
    });
  }, [router.asPath]);

  const { previous, previousSlug, next, nextSlug } = state;

  return [
    { label: previous, path: previousSlug, condition: !!previous },
    {
      label: next,
      path: nextSlug,
      condition: !!next,
    },
  ];
};

export const Pagination: React.FC<FlexProps> = props => {
  const buttons = usePagination();
  return (
    <Box maxWidth="100%" {...props}>
      <ContentWrapper
        borderTop="1px solid"
        borderColor={color('border')}
        flexDirection="row"
        alignItems="baseline"
        justify="space-between"
        pt="unset"
        pb="unset"
        width="100%"
        maxWidth="98ch"
        mx="auto"
        px={space('extra-loose')}
      >
        {buttons.map((button, index) =>
          button.condition ? (
            <PaginationLink
              textAlign={index === 0 ? 'left' : 'right'}
              slug={button.path}
              label={button.label}
              prev={index === 0}
              key={index}
            />
          ) : null
        )}
      </ContentWrapper>
    </Box>
  );
};
