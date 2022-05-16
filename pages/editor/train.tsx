import {
  Container, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Box, Button, HStack, Text, Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Editor from '../../components/editor';
import { CardType } from '../../components/editor/types';
import PrivateRoute from '../../components/PrivateRoute';
import NextLink from 'next/link';
import { EditorMode } from '../../components/editor/editor-utils';
import { shuffleArray } from '../../utils';
import { trainCardsAtom } from '../../store';
import { useRecoilValue } from 'recoil';





const MultipleTrainCards = function (props: any) {

  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [currCard, setCurrCard] = React.useState(props.trainingCards[0])

  React.useEffect(() => {
    setCurrCard(props.trainingCards[currentCardIndex])
  }, [currentCardIndex])

  const handelNextCard = () => {
    setCurrentCardIndex((c) => c + 1)
  }
  const handelCardBack = () => {
    setCurrentCardIndex((c) => c - 1)
  }

  return props.trainingCards.length === 0 ? <Text>No cards..</Text> : <Box >
    <Editor {...props} key={currCard.id} mode={EditorMode.TRAIN} card={currCard} />
    <Divider marginBlockStart={3} />
    <HStack marginBlockStart={2} justifyContent="space-between">
      <HStack>
        <Button onClick={handelNextCard} id="NEXT_TRAIN_CARD" disabled={currentCardIndex + 1 === props.trainingCards.length} >
          Next</Button>

        <Button id="BACK_TRAIN_CARD" onClick={handelCardBack} disabled={currentCardIndex === 0} >
          Back</Button>
      </HStack>
      <Box backgroundColor={"teal.100"} p={2} rounded={"base"}> {currentCardIndex + 1} / {props.trainingCards.length}</Box>
    </HStack>
  </Box>

}

const NoCards = function () {
  return <Text>No cards.</Text>
}

const UserCard = function (props: any) {
  const router = useRouter();

  const { cardId, mode, category } = router.query;
  const trainingCards = useRecoilValue(trainCardsAtom) as CardType[]
  const [editorCards, setEditorCards] = React.useState<CardType | null>(null);

  React.useEffect(() => {
    let editorCards
    if (mode === EditorMode.MULTIPLE_TRAIN) {
      let cards = [];
      if (category) {
        cards = props.userDataFromDb.cards.filter((card: CardType) => card.category === category)
      } else if (!trainingCards.length) {
        cards = props.userDataFromDb.cards
      } else {
        cards = trainingCards
      }
      editorCards = shuffleArray(cards.filter((card: CardType) => card.allowTrain))
    }
    if (mode === EditorMode.SINGLE_TRAIN) {
      editorCards = props.userDataFromDb.cards.find((card: CardType) => card.id === cardId)
    }
    setEditorCards(editorCards)
  }, [])

  const isEmptyCards = !editorCards || props.userDataFromDb.cards.length === 0;


  return (
    <Container maxW={"container.xl"}>
      <Breadcrumb separator={"-"} marginBlockStart={3}>
        <BreadcrumbItem>
          <NextLink href='/' >
            <BreadcrumbLink>Home</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Machete your cards!</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Container maxW={'container.lg'} p={4}>

        <VStack alignItems={'stretch'} spacing={0}>
          {
            isEmptyCards ? <NoCards /> : router.query.mode === EditorMode.MULTIPLE_TRAIN ?
              <MultipleTrainCards trainingCards={editorCards} {...props} /> : <Editor mode={EditorMode.TRAIN} card={editorCards} {...props} />
          }
        </VStack>
      </Container>
    </Container>
  );
};

export default PrivateRoute(UserCard);
