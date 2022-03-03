import { Container } from '@chakra-ui/react';
import { where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React from 'react';
import { useUser } from 'reactfire';
import { useSetRecoilState } from 'recoil';
import Editor from '../../components/editor';
import { CardType } from '../../components/editor/types';
import { isLoadingState } from '../../store';
import useGetData from '../../utils/useGetData';
import useGetLoadingStatus from '../../utils/useGetLoadingStatus';

const UserCard = function () {
  const params = useRouter().query;
  const { user, isLoading } = useGetLoadingStatus();
  const { resultData, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email || '')],
  });

  const card = resultData?.cards.find?.(
    (card: CardType) => card.id === params.cardId
  );

  if (isLoading || dataStatus === 'loading') {
    return <></>;
  }
  return (
    <Container maxW={'container.lg'}>
      <Editor mode='editing' card={card} />
    </Container>
  );
};

export default UserCard;
