import { Box, styled } from '@mui/material';
import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Reset from './Reset';


const pages = ['login', 'signup', 'reset'] as const;
type Page = typeof pages[number];
export interface AuthProps {
  setPage: SetFunction<Page>;
}

export default function Auth() {
  const [page, setPage] = useState<Page>('login');

  if (!pages.includes(page)) throw new Error('La pagina può essere solo, ' + pages);

  return {
    login: <Login {...{ setPage }} />,
    signup: <Signup {...{ setPage }} />,
    reset: <Reset {...{ setPage }} />,
  }[page];
}

export const RootStyle = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

export const ContentStyle = styled(Box)(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

const HeaderStyle = styled(Box)(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

export function AuthLayout({ children }: ChildrenProps) {
  return (
    <HeaderStyle>
      <Box sx={{ mt: { md: -2 } }}>{children}</Box>
    </HeaderStyle>
  );
}
