import { Container, Heading, VStack, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Editor from '../../components/editor';
import { CardType } from '../../components/editor/types';
import PrivateRoute from '../../components/PrivateRoute';

const UserCard = function (props: any) {
  const params = useRouter().query;
  const textColor = useColorModeValue("teal.700", "white")
  const card = props.userDataFromDb?.cards.find?.(
    (card: CardType) => card.id === params.cardId
  );

  if (!card) {
    return <></>;
  }
  return (
    <Container maxW={'container.lg'} p={4}>
      <VStack alignItems={'stretch'} spacing={3}>

        <Heading color={textColor} >Edit your card.</Heading>

        <Editor mode='editing' card={card} {...props} />
      </VStack>
    </Container>
  );
};

export default PrivateRoute(UserCard);
