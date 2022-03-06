import React from 'react';

import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useUser } from 'reactfire';
import { useRouter } from 'next/router';
import { addDoc } from 'firebase/firestore';
import useGetData from '../../utils/useGetData';

import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Link,
  useToast,
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
  useColorModeValue,
} from '@chakra-ui/react';

enum FormMode {
  LOGIN,
  SIGN_UP,
}

// const uiConfig = {
//   signInFlow: 'popup',
//   signInOptions: [GoogleAuthProvider.PROVIDER_ID],
//   callbacks: {
//     signInSuccessWithAuthResult: () => false,
//   },
// };

const Login = () => {
  const auth = getAuth();
  const router = useRouter();
  const { data: user } = useUser();
  const { ref } = useGetData({ dataBaseName: 'users' });
  const email = React.useRef<HTMLInputElement>(null);
  const password = React.useRef<HTMLInputElement>(null);
  const name = React.useRef<HTMLInputElement>(null);
  const [formMode, setFormMode] = React.useState<FormMode>(FormMode.LOGIN);
  const toast = useToast();
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // chakra light  dark colors
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const formBgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('black', 'white');

  const switchFormMode = () =>
    setFormMode((prev) =>
      prev === FormMode.SIGN_UP ? FormMode.LOGIN : FormMode.SIGN_UP
    );

  // when ever user changes - push to home
  React.useEffect(() => {
    if (!user) return;
    router.replace('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = async function (e: React.FormEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!email.current || !password.current) return;
    const emailVal = email?.current.value;
    const passVal = password?.current.value;
    const nameVal = name.current?.value;

    try {
      setIsSubmitting(true);
      if (formMode === FormMode.SIGN_UP) {
        await createUserWithEmailAndPassword(auth, emailVal, passVal);
        await addDoc(ref, {
          email: emailVal,
          name: nameVal,
          cards: [],
        });

        toast({
          title: 'User created!',
          status: 'success',
          duration: 1000,
        });
      } else {
        await signInWithEmailAndPassword(auth, emailVal, passVal);
      }
    } catch (error: any) {
      setError(error.message.split('Firebase:')[1]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const DefaultForm = function () {
    return (
      <>
        <FormLabel fontSize={{ base: 'small', md: 'md' }}>Email</FormLabel>
        <Input
          required
          type={'email'}
          fontSize={{ base: 'small', md: 'md' }}
          placeholder='jhon@gmail.com'
          ref={email}
          id='email'
          borderColor='gray.400'
        />
        <FormLabel fontSize={{ base: 'small', md: 'md' }}>Password</FormLabel>
        <Input
          ref={password}
          minLength={6}
          fontSize={{ base: 'small', md: 'md' }}
          id='password'
          type='password'
          placeholder='secret password..'
          borderColor='gray.400'
        />
      </>
    );
  };

  return (
    <Box bgColor={bgColor} h='full'>
      <Container maxW='container.lg'>
        <VStack spacing={10} alignItems='flex-start'>
          <VStack spacing={2} alignItems='flex-start'>
            <Heading
              marginBlockStart={5}
              color={textColor}
              fontSize={{ base: 'md', sm: '3xl', md: '5xl' }}>
              Welcome To Matchete.
            </Heading>
            <Text
              color={textColor}
              fontSize={{ base: 'small', sm: 'xl', md: '2xl' }}>
              Login to start
              <Text
                as={'span'}
                marginInline={1}
                fontWeight='semibold'
                textDecoration={'underline'}>
                Matcheting
              </Text>
              your information
            </Text>
          </VStack>

          <FormControl as={'form'} onSubmit={onSubmit} bg={formBgColor} p={5}>
            <VStack maxW='sm' alignItems='flex-start' spacing={3}>
              {formMode === FormMode.SIGN_UP && (
                <>
                  <FormLabel fontSize={{ base: 'small', md: 'md' }}>
                    Name
                  </FormLabel>
                  <Input
                    required
                    ref={name}
                    fontSize={{ base: 'small', md: 'md' }}
                    placeholder='jhon Doe'
                    borderColor='gray.400'
                  />
                </>
              )}

              <DefaultForm />
            </VStack>

            <Flex
              gap={5}
              alignItems='center'
              marginBlockStart={5}
              wrap={'wrap'}>
              <Button
                fontSize={{ base: 'small', md: 'md' }}
                type='submit'
                bg={'linkedin.600'}
                color='white'
                isLoading={isSubmitting}>
                {formMode === FormMode.LOGIN ? 'Login' : 'Sign Up'}
              </Button>
              <Flex alignItems='center' gap={2}>
                <Text fontSize={{ base: 'x-small', md: 'md' }}>
                  {formMode === FormMode.LOGIN
                    ? 'No user?'
                    : 'Have an Account?'}
                </Text>
                <Link
                  fontSize={{ base: 'xs', md: 'md' }}
                  onClick={switchFormMode}
                  color='teal.500'>
                  {formMode === FormMode.LOGIN ? 'Sign Up' : 'Login'}
                </Link>
              </Flex>
            </Flex>
            {error && (
              <Alert status='error' marginBlockStart={5}>
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
                <CloseButton
                  position='absolute'
                  right='8px'
                  top='8px'
                  onClick={() => setError('')}
                />
              </Alert>
            )}
          </FormControl>
        </VStack>
      </Container>


    </Box>
  );
};

export default Login;

{
  /* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} /> */
}
