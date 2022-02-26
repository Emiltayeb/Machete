import React from 'react';
import { useAuth, useUser } from 'reactfire';
import { useRouter } from 'next/router';
import useGetData from '../utils/useGetData';
import { where } from 'firebase/firestore';
import { CardType } from '../components/editor/types';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import { isLoadingState } from '../store';

export default function Login() {
  const router = useRouter();
  const { data: user, status } = useUser();
  const { resultData: userCards } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });
  const textColor = useColorModeValue('black', 'white');

  const setLoading = useSetRecoilState(isLoadingState);

  const isLoadingUser = status === 'loading' || typeof user === 'undefined';

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
      router.replace('/auth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onCardClick = function (id?: string) {
    if (!id) return;
    router.push(`editor/${id}`);
  };

  if (user) {
    return (
      <Container maxW={'container.xl'}>
        <VStack alignItems={'flex-start'} spacing={3}>
          <Heading color={textColor} marginBlockStart={5}>
            Welcome {user.displayName || user.email}
          </Heading>
          <Text>
            Here you can view your cards or you can{' '}
            <Button
              size={'sm'}
              bg='green.400'
              color={'white'}
              onClick={() => router.push('/editor/new')}>
              {' '}
              Creat Card
            </Button>
          </Text>
        </VStack>

        <Box p={10} bg={'gray.100'} marginBlockStart={7}>
          <Flex wrap={'wrap'} justifyContent='space-between' gap={5}>
            {userCards?.cards?.map((card: CardType) => (
              <Box flex='1' bg={'white'} borderRadius='lg' p={6} key={card.id}>
                <Flex
                  flexDirection={'column'}
                  height='full'
                  gap={5}
                  alignItems='flex-start'
                  justifyContent='space-between'>
                  <VStack alignItems={'flex-start'} spacing={1}>
                    <HStack w={'full'} justifyContent='space-between'>
                      <Heading color={'black'} fontSize={'md'}>
                        {card.title}
                      </Heading>
                      <Badge px={4} colorScheme={'facebook'}>
                        {card.category}
                      </Badge>
                    </HStack>
                    <Text color={'black'} fontSize={{ base: 'sm', sm: 'sm' }}>
                      {card.exec}
                    </Text>
                  </VStack>

                  <Button
                    size={'sm'}
                    bg={'linkedin.300'}
                    color='white'
                    onClick={() => onCardClick(card?.id)}>
                    View Card
                  </Button>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      </Container>
    );
  }
  return <></>;
}
