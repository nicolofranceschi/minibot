import { Alert, Box , Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import { logout } from 'config/firebase/auth';
import { useAuth } from 'services/auth';
import Image from 'next/image';


export const Waiting = () => {
  
  const router = useRouter();

  const { setUser } = useAuth();
  
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
      <Image src="/public/logotmr.png" alt="logo" layout='fill' />
      <Alert severity='info' sx={{ padding: '1rem', cursor: 'pointer', borderRadius: '1rem', margin: '1rem' }}>
        Benvenuto su <strong>miniBot</strong> stiamo verificando la tua richiesta di accesso, presto potrai usufruire del sistema
      </Alert>
    </Box>
  </Box>
)};
