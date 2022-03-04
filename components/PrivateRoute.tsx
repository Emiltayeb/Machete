import { Progress } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import useGetLoadingStatus from '../utils/useGetLoadingStatus';

const PrivateRoute = (Component: any) => {
  const Auth = (props: any) => {
    const router = useRouter();
    const { user, isLoading, userDataFromDb } = useGetLoadingStatus();

    React.useEffect(() => {
      console.log(user, isLoading);
    }, [user]);
    // Login data added to props via redux-store (or use react context for example)

    if (isLoading) {
      return <Progress size='xs' isIndeterminate />;
    }
    // If user is not logged in, return login component
    if (!user) {
      router.push('/auth');
    }

    // If user is logged in, return original component
    return <Component {...props} userDataFromDb={userDataFromDb} user={user} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default PrivateRoute;
