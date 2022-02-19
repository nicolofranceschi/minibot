import { Alert, Box , Button } from '@mui/material';
import { motion } from 'framer-motion';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { logout } from 'config/firebase/auth';
import { useAuth } from 'services/auth';
import Image from 'next/image';

const pathPropsBlack = {
  variants: {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: '#182740',
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: '#182740',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  transition: {
    default: { duration: 1, ease: 'easeInOut' },
    fill: { duration: 1, ease: [1, 0, 0.8, 1] },
  },
};

const pathPropsWhite = {
  variants: {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: 'rgba(255, 255, 255, 0)',
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: '#F3F3E4',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  transition: {
    default: { duration: 1, ease: 'easeInOut' },
    fill: { duration: 1, ease: [1, 0, 0.8, 1] },
  },
};

export const Waiting = () => {
  
  const router = useRouter();

  const { user, setUser } = useAuth();
  
  return(
  <Box sx={{ width: '100vw', height: '100vh', display: 'grid', placeItems: 'center' }}>
    <Button
      sx={{position:"absolute" , top: '1rem' , right: '1rem'}}
      onClick={() => {
        router.push('/')
        logout();
        setUser(null);
      }}
    >
        <LogoutIcon color='primary' />
    </Button>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center' }}>
      <Image src="public/logotmr.png" alt="logo" />
      <Alert severity='info' sx={{ padding: '1rem', cursor: 'pointer', borderRadius: '1rem', margin: '1rem' }}>
        Benvenuto su <strong>WorkingBot</strong> stiamo verificando la tua richiesta di accesso, presto potrai usufruire del sistema
      </Alert>
    </Box>
  </Box>
)};
