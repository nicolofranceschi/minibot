import '../styles/globals.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'config/firebase';
import { AuthProvider, useAuth } from 'services/auth';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box, CssBaseline } from '@mui/material';
import { logout } from 'config/firebase/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import CachedIcon from '@mui/icons-material/Cached';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Fragment } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import SpeedDialMenu from 'components/SpeedDialMenu';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {


  const router = useRouter();

  console.log(pageProps)

  return (
    <Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
        <meta name='application-name' content='miniBot' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='miniBot' />
        <meta name='description' content='App per TMR S.r.l prodotta da PineApp srl ' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-config' content='/icons/browserconfig.xml' />
        <meta name='msapplication-TileColor' content='#000000' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content='#000000' />

        <link rel='apple-touch-icon' href='/icons/touch-icon-iphone.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/icons/touch-icon-ipad.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/icons/touch-icon-iphone-retina.png' />
        <link rel='apple-touch-icon' sizes='167x167' href='/icons/touch-icon-ipad-retina.png' />

        <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#000000' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <meta property='og:type' content='gestione schede di lavorazione maglierie' />
        <meta property='og:title' content='miniBot' />
        <meta property='og:description' content='miniBot' />
        <meta property='og:site_name' content='miniBot' />
        <meta property='og:url' content='https://minibot-psi.vercel.app/' />
        <meta property='og:image' content='https://minibot-psi.vercel.app/apple-touch-icon.png' />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <AuthProvider>
            <Box>
              <Component {...pageProps} />
              < SpeedDialMenu />
            </Box>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Fragment>
  );
}
