import { Box } from "@mui/material";
import Logo from 'components/Logo'


export default function Loading() {
  return (
    <Box sx={{display: 'flex', alignItems: "center", justifyContent: 'center' , height: '100vh' , width: '100%'}}>
     <Logo />
    </Box>
  )
}