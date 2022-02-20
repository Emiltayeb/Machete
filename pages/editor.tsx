import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Editor from '../components/editor';
import useGetData from '../utils/useGetData';
import { doc, updateDoc, where } from 'firebase/firestore';
import { useUser } from 'reactfire';

// user code

const Home: NextPage = () => {
  const { data: user } = useUser();

  const { ref, db, resultData, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });

  const onCardSave = async function (cardData: { text: string; id: number }) {
    if (!user) return;

    try {
      const isFirstCard = resultData[0].cards?.length === 0;
      const updateDocREf = doc(db, 'users', resultData[0].NO_ID_FIELD);

      const updatedData = isFirstCard
        ? { text: cardData.text, id: 0 }
        : resultData[0].cards.map((card: any) => {
            if (card.id === cardData.id) {
              card.text = cardData.text;
            }
            return card;
          });

      console.log(updatedData);
      await updateDoc(updateDocREf, {
        cards: updatedData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (dataStatus === 'loading') {
    return 'Loading..';
  }

  console.log(resultData[0]);
  return (
    <>
      <Head>
        <title>Machete</title>
        <meta name='description' content='A learning tool for everyone.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h3>Create card</h3>
      <Editor
        mode='editing'
        card={resultData?.[0].cards[0]}
        onSaveCard={onCardSave}
      />
    </>
  );
};

export default Home;
