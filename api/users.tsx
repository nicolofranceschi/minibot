import { useQuery } from 'react-query';
import * as db from 'config/firebase/db';
import { useAuth } from 'services/auth';

export const useUser = (id?: string, onSuccess: (data: Awaited<ReturnType<typeof db.getUser>>['data']) => void = () => {}) =>
  useQuery([useUser.QUERY_KEY, id], () => db[useUser.QUERY_KEY](id as string), {
    enabled: Boolean(id),
    select: res => res.data,
    onSuccess,
  });
useUser.QUERY_KEY = 'getUser' as const;

export function useUsers() {
  const { user } = useAuth();
  return useQuery([useUsers.QUERY_KEY], () => db[useUsers.QUERY_KEY](user?.group ?? ''), { select: res => res.data });
}
useUsers.QUERY_KEY = 'getAllUsers' as const;

export function useUserGroup() {
  const { user } = useAuth();
  return useQuery([useUserGroup.QUERY_KEY], () => db[useUserGroup.QUERY_KEY](user?.group ?? ''), {
    select: res => res.data,
  });
}
useUserGroup.QUERY_KEY = 'getGroup' as const;
