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

  const currentCardIndex = React.useRef(0);
  const [currCard, setCurrCard] = React.useState(props.trainingCards[0])

  const handelNextCard = () => {
    currentCardIndex.current += 1
    setCurrCard(props.trainingCards[currentCardIndex.current])
  }
  const handelCardBack = () => {
    currentCardIndex.current -= 1
    setCurrCard(props.trainingCards[currentCardIndex.current])
  }

  return props.trainingCards.length === 0 ? <Text>No cards..</Text> : <Box >
    <Editor {...props} key={currCard.id} mode={EditorMode.TRAIN} card={currCard} />
    <Divider marginBlockStart={3} />
    <HStack marginBlockStart={2} justifyContent="space-between">
      <HStack>
        <Button onClick={handelNextCard} id="NEXT_TRAIN_CARD" disabled={currentCardIndex.current + 1 === props.trainingCards.length} >
          Next</Button>

        <Button id="BACK_TRAIN_CARD" onClick={handelCardBack} disabled={currentCardIndex.current === 0} >
          Back</Button>
      </HStack>
      <Box backgroundColor={"teal.100"} p={2} rounded={"base"}> {currentCardIndex.current + 1} / {props.trainingCards.length}</Box>
    </HStack>
  </Box>

}

const NoCards = function () {
  return <Text>No cards.</Text>
}

const UserCard = function (props: any) {
  const router = useRouter();
  const { cardId, mode } = router.query;

  const trainingCards = useRecoilValue(trainCardsAtom) as CardType[]

  let editorCards

  if (mode === EditorMode.MULTIPLE_TRAIN) {
    editorCards = shuffleArray((!trainingCards.length ? props.userDataFromDb.cards : trainingCards).filter((card: CardType) => card.allowTrain))
  }
  if (mode === EditorMode.SINGLE_TRAIN) {
    editorCards = props.userDataFromDb.cards.find((card: CardType) => card.id === cardId)
  }


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
