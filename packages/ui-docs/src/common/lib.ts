export const fetchLatestPackageVersion = async (): Promise<{ version?: string }> => {
  try {
    const res = await fetch('https://registry.npmjs.org/@blockstack/ui');
    const data = await res.json();
    const version = data['dist-tags'].latest;
    return { version };
  } catch (e) {
    console.log(e);
    return {
      version: '',
    };
  }
};
