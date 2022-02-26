import React from 'react';
import classes from './login.module.scss';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useUser } from 'reactfire';
import { useRouter } from 'next/router';
import { addDoc } from 'firebase/firestore';
import useGetData from '../../utils/useGetData';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

enum FormMode {
  LOGIN,
  SIGN_UP,
}

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

const Login = () => {
  const auth = getAuth();
  const router = useRouter();
  const { ref } = useGetData({ dataBaseName: 'users' });
  const email = React.useRef<HTMLInputElement>(null);
  const password = React.useRef<HTMLInputElement>(null);
  const name = React.useRef<HTMLInputElement>(null);
  const [formMode, setFormMode] = React.useState<FormMode>(FormMode.LOGIN);
  const { data: user } = useUser();
  const [error, setError] = React.useState('');

  // when ever user changes - push to home
  React.useEffect(() => {
    if (!user) return;
    router.push('/');
  }, [user]);

  const onSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    if (!email.current || !password.current) return;

    e.preventDefault();
    const emailVal = email.current.value;
    const passVal = password.current.value;
    const nameVal = name.current?.value;

    try {
      if (formMode === FormMode.SIGN_UP) {
        if (!nameVal?.length) {
          throw 'Name is required';
        }
        await addDoc(ref, {
          email: emailVal,
          name: nameVal,
          cards: [],
        });

        await createUserWithEmailAndPassword(auth, emailVal, passVal);
      } else {
        await signInWithEmailAndPassword(auth, emailVal, passVal);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <h1>{formMode === FormMode.LOGIN ? 'Login' : 'Sign Up'}</h1>

      <form className={classes.Root} onSubmit={onSubmit}>
        {formMode === FormMode.SIGN_UP && (
          <div className={classes.field}>
            <label htmlFor='name'>Name:</label>
            <input type='text' name='name' ref={name} />
          </div>
        )}
        <div className={classes.field}>
          <label htmlFor='email'>Email:</label>
          <input type='text' name='email' ref={email} />
        </div>

        <div className={classes.field}>
          <label htmlFor='password'>Password:</label>
          <input type='password' name='password' minLength={6} ref={password} />
        </div>

        <div className={classes.actions}>
          {formMode === FormMode.LOGIN ? (
            <>
              <input type='submit' data-primary value='Login' />
              <input
                type='button'
                value='Switch to Sign Up'
                onClick={() => setFormMode(FormMode.SIGN_UP)}
              />
            </>
          ) : (
            <>
              <input type='submit' value='Creat User' data-primary />
              <input
                type='button'
                value='Switch to Login'
                onClick={() => setFormMode(FormMode.LOGIN)}
              />
            </>
          )}
        </div>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        {error.length > 0 && <p className={classes.error}>{error}</p>}
      </form>
    </>
  );
};

export default Login;
