import {
  Container, Heading, VStack, useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Box,
  Button,
  HStack,
  Text,
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

const UserCard = function (props: any) {
  const params = useRouter().query;
  const textColor = useColorModeValue("teal.700", "white")
  const currentCardIndex = React.useRef(0);
  const trainingCards = useRecoilValue(trainCardsAtom)
  const [currCard, setCurrCard] = React.useState(trainingCards[0])

  const queryCardData = params?.slug?.[0];
  const isEditCard = queryCardData !== "create" && !params.mode
  const HeadingText = params.mode === EditorMode.TRAIN || params.mode === EditorMode.MULTIPLE_TRAIN ? "Machete your card" : isEditCard ? "Edit your card" : "Creat card"

  const card = props.userDataFromDb?.cards.find?.(
    (card: CardType) => card.id === queryCardData
  );

  const handelNextCard = () => {
    currentCardIndex.current += 1
    setCurrCard(trainingCards[currentCardIndex.current])
  }
  const handelCardBack = () => {
    currentCardIndex.current -= 1
    setCurrCard(trainingCards[currentCardIndex.current])
  }

  if (!card && isEditCard) {
    return <></>;
  }
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

          <BreadcrumbLink>{HeadingText}</BreadcrumbLink>

        </BreadcrumbItem>
      </Breadcrumb>
      <Container maxW={'container.lg'} p={4}>

        <VStack alignItems={'stretch'} spacing={0}>

          <Heading color={textColor} > {HeadingText}</Heading>

          {params.mode === EditorMode.MULTIPLE_TRAIN ? <>
            {trainingCards.length === 0 ? "No cards.." : <Box >
              <Editor {...props} key={currCard.id} mode={EditorMode.TRAIN} card={currCard} />
              <HStack marginBlockStart={2} justifyContent="space-between">
                <HStack>
                  <Button onClick={handelNextCard} disabled={currentCardIndex.current + 1 === trainingCards.length} >
                    Next</Button>

                  <Button onClick={handelCardBack} disabled={currentCardIndex.current === 0} >
                    Back</Button>
                </HStack>
                <Box backgroundColor={"teal.100"} p={2} rounded={"base"}> {currentCardIndex.current + 1} / {trainingCards.length}</Box>
              </HStack>
            </Box>}
          </> : <Editor mode={params.mode} card={card} {...props} />}
        </VStack>
      </Container>
    </Container>
  );
};

export default PrivateRoute(UserCard);
