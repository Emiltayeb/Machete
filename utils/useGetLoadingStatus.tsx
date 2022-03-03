import { where } from 'firebase/firestore';
import router from 'next/router';
import React from 'react';
import { useUser } from 'reactfire';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isLoadingState, cardsCategories } from '../store';
import useGetData from './useGetData';

const useGetLoadingStatus = function () {
  const { data: user, status } = useUser();
  const [isLoading, setLoading] = useRecoilState(isLoadingState);
  const [cardsCategoriesState, setCardsCategories] =
    useRecoilState(cardsCategories);

  const isLoadingUser = status === 'loading' || typeof user === 'undefined';

  const { resultData: userDataFromDb, dataStatus } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });

  console.log(cardsCategoriesState);

  React.useEffect(() => {
    if (dataStatus === 'loading') return;
    const finalCategories: Record<string, any> = {};
    userDataFromDb?.cards?.forEach((card: any) => {
      finalCategories[card.category] = card.category;
    });
    setCardsCategories(Object.keys(finalCategories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDataFromDb]);

  React.useEffect(() => {
    if (isLoadingUser) {
      setLoading(true);
      return;
    }
    if (user) {
      setLoading(false);
      return;
    }
    if (!user) {
      setLoading(false);
      router.replace('/auth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { user, isLoading, userDataFromDb, dataStatus };
};

export default useGetLoadingStatus;
