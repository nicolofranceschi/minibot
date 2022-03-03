import {  styled } from "@mui/material";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

export const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={3} square {...props} />)(() => ({
  marginTop: '1rem',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));