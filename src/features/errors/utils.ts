import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { errorStackTraceState } from '@store/ui';

function makeStackTraceSection(stackTrace: string | null) {
  if (!stackTrace) return;
  return `

#### Stack trace
\`\`\`bash
${stackTrace}
\`\`\`

`;
}

export const openGithubIssue = ({
  message,
  stackTrace,
}: {
  message: string;
  stackTrace: string | null;
}) => {
  const githubUrl = new URL('https://github.com/blockstack/stacks-wallet-web/issues/new');
  const issueParams = githubUrl.searchParams;
  const issueTitle = `[${VERSION}] Bug: <describe issue>`;
  const issueLabels = 'bug,reported-from-ui';
  const issueBody = `
<!--
  PLEASE READ:
  Thanks for creating an issue. Please include as much detail as possible,
  including screenshots, operating system, browser, and steps to recreate.

  Please make sure to update the TITLE of this issue.
-->

An error occurred while using Hiro Wallet for Web (\`${VERSION}\`).

### Error
> ${message}
${makeStackTraceSection(stackTrace)}
`;

  issueParams.set('title', issueTitle);
  issueParams.set('labels', issueLabels);
  issueParams.set('body', issueBody);

  window.open(githubUrl.toString(), '_blank');
};

export function useErrorHandler() {
  const handleOnError = useAtomCallback<void, any>(
    useCallback((_get, set, ...arg: any) => {
      set(errorStackTraceState, arg?.[0]?.stack);
    }, [])
  );
  return handleOnError;
}
