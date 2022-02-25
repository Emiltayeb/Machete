import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Editor from '../components/editor';
import useGetData from '../utils/useGetData';
import { doc, updateDoc, where } from 'firebase/firestore';
import { useUser } from 'reactfire';
import { v4 } from "uuid";
// user code

const Home: NextPage = () => {
  const { data: user } = useUser();

  const { ref, db, resultData, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });


  // TODO: Move to a different function!
  const onCardSave = async function (cardData: any, currentCardId?: string) {
    if (!user) return;

    let cardId;
    try {
      const isFirstCard = resultData[0].cards?.length === 0;
      const updateDocREf = doc(db, 'users', resultData[0].NO_ID_FIELD);

      if (isFirstCard) { cardId = v4() }

      const updatedData = isFirstCard
        ? [{ text: cardData, id: cardId }]
        : resultData[0].cards.map((card: any) => {
          if (card.id === currentCardId) {
            card.text = cardData;
          }
          return card;
        });


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
        // TODO: until you figure out all card temp return first
        card={resultData?.[0]?.cards?.[0]}
        onSaveCard={onCardSave}
      />
    </>
  );
};

export default Home;
