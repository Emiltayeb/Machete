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

const UserCard = function () {
  const params = useRouter().query;
  const { data: user } = useUser();
  const setLoading = useSetRecoilState(isLoadingState);
  const { resultData, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email || '')],
  });

  const card = resultData?.cards.find?.(
    (card: CardType) => card.id === params.cardId
  );

  React.useEffect(() => {
    if (dataStatus === 'loading') {
      setLoading(true);
      return;
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStatus]);

  if (dataStatus === 'loading') {
    return <></>;
  }
  return (
    <Container maxW={'container.lg'}>
      <Editor
        mode='editing'
        card={card}
        onSaveCard={(card) => console.log(card)}
      />
    </Container>
  );
};

export default UserCard;
