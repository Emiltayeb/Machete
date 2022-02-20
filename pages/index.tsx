import React from 'react';
import { useAuth, useUser } from 'reactfire';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import classes from './homepage.module.scss';
// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

export default function Login() {
  const router = useRouter();
  const auth = useAuth();
  const { status, data: user } = useUser();

  React.useEffect(() => {
    if (user) return;
    router.replace('/auth/login');
  }, [user]);

  if (!user) {
    return <></>;
  }
  if (user) {
    return (
      <div className={classes.Root}>
        <h1>Home Page</h1>
        <h4>Hello {user.email}</h4>
        <div className={classes.actions_buttons}>
          <button onClick={() => signOut(auth)}>Logout</button>
          <button onClick={() => router.push('/editor')}>Creat Card</button>
        </div>
      </div>
    );
  }
}
