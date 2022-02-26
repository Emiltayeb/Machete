import { where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React from 'react';
import { useUser } from 'reactfire';
import Editor from '../../components/editor';
import { CardType } from '../../components/editor/types';
import useGetData from '../../utils/useGetData';

const UserCard = function () {
  const params = useRouter().query;
  const { data: user } = useUser();
  const { resultData, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email || '')],
  });

  const card = resultData?.cards.find?.(
    (card: CardType) => card.id === params.cardId
  );

  if (dataStatus === 'loading') {
    return <>Loading..</>;
  }
  return (
    <div>
      <Editor
        mode='editing'
        card={card}
        onSaveCard={(card) => console.log(card)}
      />
    </div>
  );
};

export default UserCard;
