import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Editor from '../../components/editor';
import { CardType } from '../../components/editor/types';
import PrivateRoute from '../../components/PrivateRoute';

const UserCard = function (props: any) {
  const params = useRouter().query;

  const card = props.userDataFromDb?.cards.find?.(
    (card: CardType) => card.id === params.cardId
  );

  if (!card) {
    return <></>;
  }
  return (
    <Container maxW={'container.lg'}>
      <Editor mode='editing' card={card} />
    </Container>
  );
};

export default PrivateRoute(UserCard);
