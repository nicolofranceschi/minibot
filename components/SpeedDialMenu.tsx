
import {  useAuth } from 'services/auth';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, } from '@mui/material';
import { logout } from 'config/firebase/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import CachedIcon from '@mui/icons-material/Cached';
import { useRouter } from "next/router";


export default function SpeedDialMenu() {

  const router = useRouter();

  const { setUser } = useAuth()

  return (
    <SpeedDial ariaLabel='SpeedDial basic example' sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
      <SpeedDialAction key={'add'} icon={<AddIcon />} tooltipTitle={'Nuovo elemento'} onClick={() => router.push('/')} />
      <SpeedDialAction key={'search'} icon={<SearchIcon />} tooltipTitle={'Cerca elemento'} onClick={() => router.push('/search')} />
      <SpeedDialAction key={'user'} icon={<AccountCircleIcon />} tooltipTitle={'Gestione utenti'} onClick={() => router.push('/user')} />
      <SpeedDialAction key={'logout'} icon={<LogoutIcon />} tooltipTitle={'Esci'} onClick={() => {setUser(null); router.push('/'); logout(); }} />
      <SpeedDialAction key={'reload'} icon={<CachedIcon />} tooltipTitle={'Ricarica'} onClick={() => { router.reload(); }} />
    </SpeedDial>
  )
}