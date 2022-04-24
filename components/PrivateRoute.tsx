import { Progress } from '@chakra-ui/react';
import { getApp } from 'firebase/app';
import { useRouter } from 'next/router';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { userCategoriesAtom } from '../store';
import useGetLoadingStatus from '../utils/useGetLoadingStatus';
import { CardType } from './editor/types';

const PrivateRoute = (Component: any) => {
  const Auth = (props: any) => {
    const router = useRouter();
    const { user, isLoading, userDataFromDb, db, dataStatus } = useGetLoadingStatus();

    const loading = isLoading || dataStatus === "loading"

    const setUserCategories = useSetRecoilState<any>(userCategoriesAtom)
    React.useEffect(() => {
      if (dataStatus === "loading") return
      const categories = userDataFromDb?.cards?.map((card: CardType) => card.category)
      setUserCategories([...new Set(categories)])
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDataFromDb?.cards])


    if (loading) {
      return <Progress size='xs' isIndeterminate />;
    }
    if (!user) {
      router.push('/auth');
      return <></>
    }



    // If user is not logged in, return login component


    // If user is logged in, return original component
    return <Component {...props} userDataFromDb={userDataFromDb} user={user} db={db} dbStatus={dataStatus} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default PrivateRoute;
