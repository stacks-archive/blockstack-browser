import { useEffect, useState } from 'react';

export function useMountEffect() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);
  return mounted;
}
