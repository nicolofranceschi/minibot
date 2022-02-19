import { Typography, Button, Stack } from '@mui/material';

interface ChangePageButtonProps {
  text: string;
  buttonText: string;
  onClick: () => void;
}

export default function ChangePageButton({ text, buttonText, onClick }: ChangePageButtonProps) {
  return (
    <Stack direction='row' sx={{ mt: 3 , position:"absolute" , right:"1rem" }} alignItems='center'>
      <Typography variant='body2'>{text}</Typography>
      <Button variant='text' onClick={onClick}>
        {buttonText}
      </Button>
    </Stack>
  );
}