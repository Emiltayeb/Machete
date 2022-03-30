import {
  Container, Heading, VStack, useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Button,
  HStack,
  Text,
  Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Editor from '../../components/editor';
import { CardType } from '../../components/editor/types';
import PrivateRoute from '../../components/PrivateRoute';
import NextLink from 'next/link';
import { useRecoilValue } from 'recoil';
import { trainCardsAtom } from '../../store';
import { EditorMode } from '../../components/editor/editor-utils';




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
        <Button onClick={handelNextCard} disabled={currentCardIndex.current + 1 === props.trainingCards.length} >
          Next</Button>

        <Button onClick={handelCardBack} disabled={currentCardIndex.current === 0} >
          Back</Button>
      </HStack>
      <Box backgroundColor={"teal.100"} p={2} rounded={"base"}> {currentCardIndex.current + 1} / {props.trainingCards.length}</Box>
    </HStack>
  </Box>

}

// TODO: This page should get ad id in the param so make it act like smart-link - load the card  if its not in the store

const UserCard = function (props: any) {
  const router = useRouter();
  const textColor = useColorModeValue("teal.700", "white")
  const trainingCards = useRecoilValue(trainCardsAtom)
  const noTrainingCards = !trainingCards || Array.isArray(trainingCards) && !trainingCards?.length


  return (
    <Container maxW={"container.xl"}>
      <Breadcrumb separator={"-"} marginBlockStart={3}>
        <BreadcrumbItem>
          <NextLink href='/'
          >
            <BreadcrumbLink>Home</BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>

        <BreadcrumbItem>

          <BreadcrumbLink>Machete your cards!</BreadcrumbLink>

        </BreadcrumbItem>
      </Breadcrumb>
      <Container maxW={'container.lg'} p={4}>

        <VStack alignItems={'stretch'} spacing={0}>

          <Heading color={textColor} >Train your cards</Heading>
          {
            noTrainingCards ? <Text>No cards.</Text> :
              router.query.mode === EditorMode.MULTIPLE_TRAIN ?
                <MultipleTrainCards
                  trainingCards={Array.isArray(trainingCards) ? [...trainingCards].sort(() => .5 - Math.random()) : trainingCards} {...props} />
                : <Editor mode={EditorMode.TRAIN} card={trainingCards as CardType}
                  {...props} />
          }

        </VStack>
      </Container>
    </Container>
  );
};

export default PrivateRoute(UserCard);
