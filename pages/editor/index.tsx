import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Editor from '../../components/editor';
import useGetData from '../../utils/useGetData';
import { doc, updateDoc, where } from 'firebase/firestore';
import { useUser } from 'reactfire';
import { v4 } from "uuid";
import { CardType, SaveCardArgs } from '../../components/editor/types';
// user code

const Home = () => {
  const { data: user } = useUser();
  const [currentCard, setCurrentCard] = React.useState<CardType | null>(null);

  const { db, resultData, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });


  // TODO: Move to a different function!
  const onCardSave = async function ({ codeLanguages, id, jsonText }: SaveCardArgs) {
    if (!user) return;

    let cardId;
    try {
      const isNewCard = !id;
      console.log(isNewCard, resultData)
      const updateDocREf = doc(db, 'users', resultData.NO_ID_FIELD);

      if (isNewCard) { cardId = v4() }

      const updatedData = isNewCard
        ? [...resultData?.cards, { text: jsonText, id: cardId, codeLanguages }]
        : resultData.cards.map((card: any) => {
          if (card.id === id) {
            card.text = jsonText;
            card.codeLanguages = codeLanguages
          }
          return card;
        });


      await updateDoc(updateDocREf, {
        cards: updatedData,
      });

      // now the card is in the db. put it in the db
      setCurrentCard({ codeLanguages, id: cardId, text: jsonText })
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
        card={currentCard}
        onSaveCard={onCardSave}
      />
    </>
  );
};

export default Home;
