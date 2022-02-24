import { useEffect, useState } from 'react';

export default function useDebounce(request: any, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(request);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(request), delay);
    return () => clearTimeout(handler);
  }, [request, delay]);

  return debouncedValue;
}
