import Auth from 'features/Auth';
import { Waiting } from 'features/Auth/Waiting';
import * as fb from 'config/firebase/auth';
import * as db from 'config/firebase/db';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';

type LoginProps = { email: string; password: string };
type SignupProps = { name: string; email: string; password: string , notes: string , group: string };
type ResetProps = { email: string };
type AuthContextType = {
  user: User | null;
  setUser: SetFunction<User | null>;
  login: (p: LoginProps) => void;
  signup: (p: SignupProps) => void;
  logout: EmptyFunction;
  reset: (p: ResetProps) => void;
};

const initialValue = {
  user: null,
  setUser: () => {},
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  reset: () => Promise.resolve(),
};

const AuthContext = createContext<AuthContextType>(initialValue);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: ChildrenProps) {
  
  const { mutate: login } = useMutation(({ email, password }: LoginProps) => fb.login(email, password));
  const { mutate: signup } = useMutation(({ name, email, password , notes , group }: SignupProps) => fb.signup(name, email, password , notes , group));
  const { mutate: logout } = useMutation(() => fb.logout());
  const { mutate: reset } = useMutation(({ email }: ResetProps) => fb.reset(email));

  const { mutate: getUser, isLoading } = useMutation(({ user }: { user: string }) => db.getUser(user));

  const [user, setUser] = useState<User | null>(null);

  useEffect(
    () =>
      fb.onAuthStateChanged(async user => {
        if (!user) return;
        getUser(
          { user: user.uid },
          {
            onSuccess: ({ data }) => {
              if (!data) toast.error('Unable to fetch user data');
              else setUser(data);
            },
          },
        );
      }),
    [getUser],
  );

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      signup,
      logout,
      reset,
    }),
    [user, login, signup, logout, reset],
  );

  return <AuthContext.Provider value={value}>{user ? user.status === 'WAITING' ? <Waiting /> : children : isLoading ? <Waiting /> : <Auth />}</AuthContext.Provider>;
}
