import { Box, styled, Card, Typography, Container, Stack, Alert, Button, Tooltip } from '@mui/material';
import { useAuth } from 'services/auth';
import { AuthProps, ContentStyle, RootStyle, AuthLayout } from '.';
import Form from 'components/Form';
import Hidden from 'components/Hidden';
import { LoadingButton } from '@mui/lab';
import ChangePageButton from './ChangePageButton';
import { Toaster } from 'react-hot-toast';

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '1rem' , 
  backgroundColor: '#1664C0',
  margin: theme.spacing(2, 0, 2, 2),
}));

export default function Login({ setPage }: AuthProps) {
  const { login } = useAuth();

  const changePageButtonProps = {
    text: 'Non hai un account?',
    buttonText: 'Registrati',
    onClick: () => setPage('signup'),
  };

  return (
    <RootStyle>
      <Toaster />
      <AuthLayout>
        <ChangePageButton {...changePageButtonProps} />
      </AuthLayout>

      <Hidden breakpoint='md' direction='down'>
        <SectionStyle >
          <Typography variant='h3' sx={{ px: 10, mt: 10, mb: 5, color: 'white' }}>
            Ciao, bentornato
          </Typography>
        </SectionStyle>
      </Hidden>

      <Container maxWidth='sm'>
        <ContentStyle>
          <Stack direction='row' alignItems='center' sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant='h4' gutterBottom>
                miniBOT
              </Typography>
            </Box>
          </Stack>

          <Alert severity='info' sx={{ mb: 3 }}>
            {`Inserisci email e password se hai già un account`}
          </Alert>

          <Form<Parameters<typeof login>[0]> onSubmit={login}>
            <Stack spacing={3}>
              <Form.Input label='Email' name='email' fullWidth required />
              <Form.Password label='Password' name='password' fullWidth required />
              {/* TODO: aggiungere loading */}
              <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ my: 2 }}>
                <Button variant='text' onClick={() => setPage('reset')}>
                  Password dimenticata?
                </Button>
              </Stack>
              <LoadingButton fullWidth size='large' type='submit' variant='contained' loading={false}>
                Login
              </LoadingButton>
            </Stack>
          </Form>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
