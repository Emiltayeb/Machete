import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Editor from '../../components/editor';
import useGetData from '../../utils/useGetData';
import { doc, updateDoc, where } from 'firebase/firestore';
import { useUser } from 'reactfire';
import { v4 } from 'uuid';
import { CardType } from '../../components/editor/types';
import {
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// user code

const Home = () => {
  const { data: user } = useUser();
  const [currentCard, setCurrentCard] = React.useState<CardType | null>(null);
  const textColor = useColorModeValue('black', 'white');
  const { db, resultData, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });

  // TODO: Move to a different function!
  const onCardSave = async function (userCardData: CardType) {
    if (!user) return;

    let cardId;
    try {
      const isNewCard = !userCardData.id;

      const updateDocREf = doc(db, 'users', resultData.NO_ID_FIELD);

      if (isNewCard) {
        cardId = v4();
      }

      // const updatedData = isNewCard
      //   ? [
      //       ...resultData?.cards,
      //       { text: userCardData.text, id: cardId, codeLanguages:userCardData.codeLanguages },
      //     ]
      //   : resultData.cards.map((card: any) => {
      //       if (card.id === id) {
      //         card.text = jsonText;
      //         card.codeLanguages = codeLanguages;
      //       }
      //       return card;
      //     });

      // await updateDoc(updateDocREf, {
      //   cards: updatedData,
      // });

      // now the card is in the db. put it in the db
      setCurrentCard(userCardData);
    } catch (error) {
      // console.log(error);
    }
  };

  if (dataStatus === 'loading') {
    return 'Loading..';
  }

  return (
    <Container maxW={'container.lg'} p={4}>
      <Head>
        <title>Machete - Create card</title>
        <meta name='description' content='A learning tool for everyone.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <VStack alignItems={'stretch'} spacing={3}>
        <VStack alignItems={'flex-start'} spacing={1}>
          <Heading color={textColor}>Create card</Heading>
          <Text>Here you can creat a memory card and save it.</Text>
        </VStack>
        <Editor mode='editing' card={currentCard} onSaveCard={onCardSave} />
      </VStack>
    </Container>
  );
};

export default Home;
