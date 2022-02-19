import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from '@firebase/auth';
import toast from 'react-hot-toast';
import { tryCatcher } from 'utils/functions';
import { createUser, getAllUsers } from './db';

const auth = getAuth();

export const onAuthStateChanged = (cb: (user: User | null) => void) => auth.onAuthStateChanged(cb, error => toast.success('autenticato'));

export async function signup(name: string, email: string, password: string, note: string, group: string) {
  const { data: users } = await getAllUsers(group);
  const { data, error } = await tryCatcher(() => createUserWithEmailAndPassword(auth, email, password));
  if (data) await createUser(data.user.uid, { email, name, status: users?.length === 0 ? 'ADMIN' : 'WAITING', note, group });
  return { data: data?.user, error };
}

export async function login(email: string, password: string) {
  const { data, error } = await tryCatcher(() => signInWithEmailAndPassword(auth, email, password));
  return { data: data?.user, error };
}

export const logout = () => tryCatcher(() => signOut(auth));
export const reset = (email: string) => tryCatcher(() => sendPasswordResetEmail(auth, email));