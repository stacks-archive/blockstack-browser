import { useEffect, useState } from 'react';

export function useMountEffect() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);
  return mounted;
}
