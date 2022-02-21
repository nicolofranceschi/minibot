import '../styles/globals.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'config/firebase';
import { AuthProvider } from 'services/auth';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box, CssBaseline } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode';


const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
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

  const [darkMode, setDarkMode] = useState(false)

  const router = useRouter()

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          <AuthProvider>
            <Box>
              <Component {...pageProps} />
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
              >
                <SpeedDialAction
                  key={"add"}
                  icon={<AddIcon />}
                  tooltipTitle={"Nuovo elemento"}
                  onClick={() => router.push("/")}
                />
                <SpeedDialAction
                  key={"search"}
                  icon={<SearchIcon />}
                  tooltipTitle={"Cerca elemento"}
                />
                <SpeedDialAction
                  key={"user"}
                  icon={<AccountCircleIcon />}
                  tooltipTitle={"Gestione utenti"}
                  onClick={() => router.push("/user")}
                />
                <SpeedDialAction
                  key={"DarkMode"}
                  icon={<DarkModeIcon />}
                  tooltipTitle={"Dark Mode"}
                  onClick={() => setDarkMode(e=>!e)}
                />
              </SpeedDial>
            </Box>
          </AuthProvider>
         
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
