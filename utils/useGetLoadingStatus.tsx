import { where } from 'firebase/firestore';
import React from 'react';
import { useUser } from 'reactfire';
import useGetData from './useGetData';

const useGetLoadingStatus = function () {
  const { data: user, status } = useUser();
  const [isLoading, setLoading] = React.useState(true);

  const {
    resultData: userDataFromDb,
    dataStatus,
    db,
  } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });


  React.useEffect(() => {
    const isLoadingUser = status === 'loading' || typeof user === 'undefined';
    setLoading(isLoadingUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { user, isLoading, userDataFromDb, dataStatus, db };
};

export default useGetLoadingStatus;
