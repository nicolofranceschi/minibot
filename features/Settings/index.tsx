import { useAuth } from 'services/auth';
import { Box, Alert, Stack, Paper } from '@mui/material';
import UserForm from './UserForm';
import { useState } from 'react';
import { useUsers } from 'api/users';
import { BasicCard } from './BasicCard';
import GroupForm from './GroupForm';

export default function Home() {

  const { user } = useAuth();

  const [data, setData] = useState<User | null>(user);

  const { data: allUsers } = useUsers()

  return (
    <Stack direction="column" sx={{ padding: "1rem", position: 'relative', gap: 3 , height: '100%' }}>
      <Box sx={{ flexGrow: 1 , display: 'flex', flexDirection: 'row', flexWrap: "wrap",gap: 2 , height: '100%'}}>
        <Paper sx={{ borderRadius: '1rem',flexGrow: 1 , }}>
          <GroupForm />
        </Paper>
        <Paper sx={{ borderRadius: '1rem',flexGrow: 1 , }}>
          <UserForm {...{ user: data }} />
        </Paper>
      </Box>
      {user?.status === 'ADMIN' && (
        <Box sx={{ flexGrow: 3 }}>
          <Alert severity='info' sx={{ padding: '1rem', borderRadius: '1rem' }}>
            Seleziona un utente del gruppo per modificarlo
          </Alert>
          <Stack direction="row" flexWrap='wrap' sx={{ gap: '1rem' , padding: '1rem 0'}}>
            {allUsers?.map((user: User) => (
              <BasicCard key={user.id} {...{ user, setData }} />
            ))
            }
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
