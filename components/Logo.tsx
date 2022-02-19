import { Box } from "@mui/material";
import { motion } from 'framer-motion';

const pathPropsBlack = {
  variants: {
    hidden: {
      opacity: 0,
      pathLength: 0,
      fill: '#1876D0',
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      fill: '#1876D0',
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


export default function Logo() {
  return (
    <Box sx={{borderRadius: '0.5rem' , backgroundColor:"#1876D0",  display: 'flex', alignItems:"center", justifyContent: 'center'}}>
     <svg width='50' height='50' style={{padding: '10'}} viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'>
      <motion.path
        {...pathPropsBlack}
        d='M36 32C36 33.0609 35.5786 34.0783 34.8284 34.8284C34.0783 35.5786 33.0609 36 32 36H4C2.93913 36 1.92172 35.5786 1.17157 34.8284C0.421427 34.0783 0 33.0609 0 32V4C0 2.93913 0.421427 1.92172 1.17157 1.17157C1.92172 0.421427 2.93913 0 4 0L32 0C33.0609 0 34.0783 0.421427 34.8284 1.17157C35.5786 1.92172 36 2.93913 36 4V32Z'
      />
      <motion.path
        {...pathPropsWhite}
        d='M4.298 9.83806C4.20919 9.49395 4.16748 9.13939 4.174 8.78406C4.174 7.79206 5.011 6.73806 6.375 6.73806C7.863 6.73806 8.577 7.60606 8.855 8.97006L11.491 22.1471H11.553L15.584 8.56706C15.925 7.45106 16.856 6.73706 18.002 6.73706C19.15 6.73706 20.079 7.45006 20.421 8.56706L24.451 22.1471H24.513L27.15 8.97006C27.427 7.60606 28.142 6.73806 29.63 6.73806C30.993 6.73806 31.831 7.79206 31.831 8.78406C31.831 9.21806 31.8 9.43506 31.706 9.83806L27.77 26.7681C27.459 28.0711 26.436 29.1861 24.701 29.1861C24.0128 29.1945 23.3406 28.9781 22.7867 28.5696C22.2328 28.1612 21.8273 27.583 21.632 26.9231L18.035 14.9541H17.973L14.376 26.9231C14.1802 27.5829 13.7745 28.1609 13.2205 28.5693C12.6664 28.9777 11.9943 29.1943 11.306 29.1861C9.57 29.1861 8.547 28.0711 8.236 26.7681L4.298 9.83806Z'
      />
    </svg>
    </Box>
  )
}