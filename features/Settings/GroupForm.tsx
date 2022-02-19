import { LoadingButton } from '@mui/lab';
import { Typography, Stack, Box } from '@mui/material';
import { addDataToGroup } from 'config/firebase/db';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import Form from 'components/Form';
import { useUserGroup } from 'api/users';

export default function GroupForm() {
  const queryClient = useQueryClient();

  const { data: group } = useUserGroup();

  const handleSubmit = (data: any) => {
    updateGroup.mutate(
      { id: group?.id, data },
      {
        onSuccess: () => {
          toast.success('Gruppo aggiornato');
          queryClient.invalidateQueries(['getAllUsers']);
        },
      },
    );
  };

  const updateGroup = useMutation(({ id, data }: any) => addDataToGroup(id, data));

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Stack flexDirection='row' justifyContent='space-between' alignItems='center' sx={{ padding: '1rem' }}>
        <Typography variant='h6'>Opzioni Gruppo</Typography>
      </Stack>
      <Stack spacing={3} sx={{ padding: '1rem' }}>
        <Form onSubmit={handleSubmit} style={{ height: '100%' }} defaultValues={group ?? {}}>
          <Typography variant='body2' sx={{ pb: '0.5rem' }}>
            Nome del gruppo
          </Typography>
          <Form.Input name='name' fullWidth />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type='submit' variant='contained' loading={updateGroup.isLoading}>
              SALVA
            </LoadingButton>
          </Box>
        </Form>
      </Stack>
    </Stack>
  );
}
