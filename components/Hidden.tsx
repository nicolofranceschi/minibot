import { Theme, useMediaQuery, Breakpoint } from '@mui/material';

const directions = ['down', 'up'] as const;

interface HiddenProps extends ChildrenProps {
  breakpoint: Breakpoint;
  direction: typeof directions[number];
}

export default function Hidden({ breakpoint, direction, children }: HiddenProps) {
  if (!directions.includes(direction)) throw new Error('Direction must be one of: ' + directions);
  const queries = {
    down: useMediaQuery<Theme>(theme => theme.breakpoints.down(breakpoint)),
    up: useMediaQuery<Theme>(theme => theme.breakpoints.up(breakpoint)),
  };
  return !queries[direction] ? <>{children}</> : null;
}
