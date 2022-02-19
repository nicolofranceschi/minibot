import { Box, Typography, Container, Stack, Tooltip } from '@mui/material';
import { useAuth } from 'services/auth';
import { AuthProps, ContentStyle, RootStyle, AuthLayout } from '.';
import Form from 'components/Form';
import { LoadingButton } from '@mui/lab';
import ChangePageButton from './ChangePageButton';
import { Toaster } from 'react-hot-toast';

export default function Login({ setPage }: AuthProps) {
  const { reset } = useAuth();

  const changePageButtonProps = {
    text: '',
    buttonText: 'Torna al login',
    onClick: () => setPage('login'),
  };

  return (
    <RootStyle>
      <Toaster />
      <AuthLayout>
        <ChangePageButton {...changePageButtonProps} />
      </AuthLayout>

      <Container maxWidth='sm'>
        <ContentStyle>
          <Stack direction='row' alignItems='center' sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant='h4' gutterBottom>
                miniBOT
              </Typography>
            </Box>
          </Stack>

          <Form<Parameters<typeof reset>[0]> onSubmit={reset}>
            <Stack spacing={3}>
              <Form.Input label='Email' name='email' fullWidth required />
              {/* TODO: aggiungere loading */}
              <LoadingButton fullWidth size='large' type='submit' variant='contained' loading={false}>
                Reset password
              </LoadingButton>
            </Stack>
          </Form>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
