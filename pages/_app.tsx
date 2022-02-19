import '../styles/globals.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'config/firebase';
import { AuthProvider } from 'services/auth';

import Head from 'next/head';


const theme = createTheme();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20000,
      refetchOnWindowFocus: false,
    },
  },
});


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
           
                <Component {...pageProps} />
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
