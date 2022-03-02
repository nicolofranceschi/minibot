
import { LoadingButton } from '@mui/lab';
import { Box, MenuItem, Stack, Chip, Typography } from '@mui/material';
import { addDataToUser } from 'config/firebase/db';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import Form from 'components/Form';


export default function UserForm({ user }: any) {

  const queryClient = useQueryClient();

  const handleSubmit = (data: any) => {
    console.log(data)
    updateUser.mutate(
      { id: user.id, data },
      {
        onSuccess: () => {
          toast.success('Profilo aggiornato');
          queryClient.invalidateQueries(["getAllUsers"])
        },
      },
    );
  };

  const updateUser = useMutation(({ id, data }: any) => addDataToUser(id, data));

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Stack flexDirection='row' justifyContent='space-between' alignItems='center' sx={{ padding: '1rem' }}>
        <Typography variant='h6'>Opzioni Utente</Typography>
        <Chip sx={{ width: 100 }} label={user.status} color={user.status === 'WAITING' ? 'error' : 'success'}></Chip>
      </Stack>
      <Stack spacing={3} sx={{ padding: '1rem' }}>
        <Form onSubmit={handleSubmit} style={{ height: '100%' }} defaultValues={user}>
          <Stack direction='column' spacing={{ xs: 3, sm: 2 }}>
            <Stack flexDirection='row' flexWrap='wrap' alignItems='center' sx={{ gap: '1rem' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ mb: "0.5rem" }} >Nome utente</Typography>
                <Form.Input name='name' fullWidth />
              </Box>
              <Form.Hidden name='email' />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ mb: "0.5rem" }} >Permessi utente</Typography>
                <Typography variant="body2" sx={{ mb: "0.5rem" , fontSize: 10 }} >Ricarica per vedere gli effetti</Typography>
                <Form.SelectForm name='status' fullWidth>
                  <MenuItem value={'ADMIN'}>ADMIN</MenuItem>
                  <MenuItem value={'USER'}>USER</MenuItem>
                  <MenuItem value={'TECNICO'}>TECNICO</MenuItem>
                  <MenuItem value={'WAITING'}>WAITING</MenuItem>
                </Form.SelectForm>
              </Box>
            </Stack>
          </Stack>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type='submit' variant='contained' loading={updateUser.isLoading}>
              salva
            </LoadingButton>
          </Box>
        </Form>
      </Stack>
    </Stack>
  );
}
