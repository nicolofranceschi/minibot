import { LoadingButton } from '@mui/lab';
import { Alert, Container, Stack, Tooltip, Typography, Box } from '@mui/material';
import { useAuth } from 'services/auth';
import Hidden from 'components/Hidden';
import { AuthProps, ContentStyle, RootStyle, AuthLayout } from '.';
import { styled, Card, TextField } from '@mui/material';
import Form from 'components/Form';
import ChangePageButton from './ChangePageButton';
import { Toaster } from 'react-hot-toast';
import { useMutation } from 'react-query';
import { getGroup } from 'config/firebase/db';
import { useState } from 'react';

export default function Signup({ setPage }: AuthProps) {
  const { signup } = useAuth();

  const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: '1rem',
    backgroundColor: '#1664C0',
    margin: theme.spacing(2, 0, 2, 2),
  }));

  const changePageButtonProps = {
    text: 'Hai già un account?',
    buttonText: 'Login',
    onClick: () => setPage('login'),
  };

  const [group, setGroup] = useState<Group | null>();

  const isGroup = useMutation((e: string) => getGroup(e));

  const checkGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
    isGroup.mutate(event.target.value, {
      onSuccess: res => setGroup(res.data),
    });
  };

  return (
    <RootStyle>
      <Toaster />
      <AuthLayout>
        <ChangePageButton {...changePageButtonProps} />
      </AuthLayout>

      <Hidden breakpoint='md' direction='down'>
        <SectionStyle>
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
            {`Info per l'utente`}
          </Alert>
          <Form<Parameters<typeof signup>[0]> onSubmit={res => signup({ ...res, group: group?.id ? group.id : '' })}>
            <Stack direction='row' flexWrap='wrap' sx={{ gap: 2 }}>
              <Form.Input label='Nome' name='name' sx={{ flexGrow: 1 }} />
              <Form.Input label='Email' name='email' sx={{ flexGrow: 1 }} />
              <Form.Input label='Password' name='password' sx={{ flexGrow: 1 }} />
              <Form.Input label='Ruolo desiderato/Note' name='notes' sx={{ flexGrow: 1 }} />
              <TextField label='Licenza' name='licenza' sx={{ flexGrow: 1 }} color={group ? 'success' : 'warning'} onChange={checkGroup} helperText={group?.name ? group.name : 'Nome del gruppo'} />
              {/* TODO: mettere il loading */}
              <LoadingButton fullWidth size='large' type='submit' variant='contained' disabled={!Boolean(group)}>
                Registrati
              </LoadingButton>
            </Stack>
          </Form>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
