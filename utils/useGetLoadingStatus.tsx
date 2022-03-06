import { where } from 'firebase/firestore';
import router from 'next/router';
import React from 'react';
import { useUser } from 'reactfire';
import useGetData from './useGetData';

const useGetLoadingStatus = function () {
  const { data: user, status } = useUser();

  const [isLoading, setLoading] = React.useState(true);
  // const [cardsCategoriesState, setCardsCategories] =
  //   useRecoilState(cardsCategories);

  const {
    resultData: userDataFromDb,
    dataStatus,
    db,
  } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });

  React.useEffect(() => {
    if (dataStatus === 'loading') return;
    const finalCategories: Record<string, any> = {};
    userDataFromDb?.cards?.forEach((card: any) => {
      finalCategories[card.category] = card.category;
    });
    // setCardsCategories(Object.keys(finalCategories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDataFromDb]);

  React.useEffect(() => {
    const isLoadingUser = status === 'loading' || typeof user === 'undefined';
    setLoading(isLoadingUser);
  }, [user]);

  return { user, isLoading, userDataFromDb, dataStatus, db };
};

export default useGetLoadingStatus;
