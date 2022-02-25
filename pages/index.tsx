import React from 'react';
import { useAuth, useUser } from 'reactfire';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import classes from './homepage.module.scss';
import useGetData from '../utils/useGetData';
import { where } from 'firebase/firestore';
import Card from '../components/layout/Card';
import { CardType } from '../components/editor/types';
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
  const { db, resultData, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });


  React.useEffect(() => {
    if (user || (status === "success" && !user)) return;
    router.replace('/auth');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  const onCardClick = function (id?: string) {
    if (!id) return
    router.push(`editor/${id}`)
  }


  if (!user) {
    return <>Loading..</>
  }

  console.log(resultData)
  if (user) {
    return (
      <div className={classes.Root}>
        <h1>Home Page</h1>
        <h4>Hello {user.email}</h4>

        <div className={classes.actions_buttons}>
          <button onClick={() => signOut(auth)}>Logout</button>
          <button onClick={() => router.push('/editor')}>Creat Card</button>
        </div>

        <div className={classes.cards}>
          {resultData?.cards?.map((card: CardType) => <Card onClick={() => onCardClick(card?.id)} key={card.id}>
            {card.text}
          </Card>)}
        </div>
      </div>
    );
  }
}
