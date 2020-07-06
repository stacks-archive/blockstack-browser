import React from 'react';
import GettingStarted from './_getting-started.mdx';
import { useAppState } from '@common/hooks/use-app-state';
import { fetchLatestPackageVersion } from '@common/lib';

const Homepage = ({ version }: { version: string }) => {
  const { version: _version, doSetVersion } = useAppState();
  React.useEffect(() => {
    if (version && _version !== version) {
      doSetVersion(version);
    }
  }, [_version, version]);
  return <GettingStarted />;
};

export async function getStaticProps() {
  return {
    props: await fetchLatestPackageVersion(),
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every second
    unstable_revalidate: 1,
  };
}

export default Homepage;
