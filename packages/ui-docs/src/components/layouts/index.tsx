import React from 'react';
import { DocsLayout } from '@components/docs-layout';
import Head from 'next/head';
export default function Layout(frontMatter) {
  const {
    title,
    description = 'The Blockstack design system, built with React and styled-system.',
    headings,
  } = frontMatter;

  return ({ children }) => {
    return (
      <>
        <Head>
          <title>{title} | Blockstack UI</title>
          <meta name="description" content={description} />
        </Head>
        <DocsLayout headings={headings}>{children}</DocsLayout>
      </>
    );
  };
}
