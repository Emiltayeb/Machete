import { Progress } from '@chakra-ui/react';
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
    const setUserCategories = useSetRecoilState<any>(userCategoriesAtom)
    // Login data added to props via redux-store (or use react context for example)

    React.useEffect(() => {
      if (dataStatus === "loading") return
      const categories = userDataFromDb?.cards?.map((card: CardType) => card.category)
      setUserCategories([...new Set(categories)])
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDataFromDb?.cards])

    if (isLoading || dataStatus === "loading") {
      return <Progress size='xs' isIndeterminate />;
    }
    // If user is not logged in, return login component
    if (!user) {
      router.push('/auth');
    }



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