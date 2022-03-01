import { useEffect, useRef, useState } from 'react';
import useWindowSize from 'utils/useWindowSize';

export default function useOffset(params?: any) {
  const { width } = useWindowSize();
  const ref = useRef<HTMLElement>();
  const [offset, setOffset] = useState(0);
  useEffect(() => ref.current && setOffset(ref.current.scrollWidth - ref.current.offsetWidth), [width,params]);
  return { ref, offset };
}