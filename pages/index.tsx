import React from 'react';
import { useUser } from 'reactfire';
import { useRouter } from 'next/router';
import useGetData from '../utils/useGetData';
import { where } from 'firebase/firestore';
import { CardType } from '../components/editor/types';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import PrivateRoute from '../components/PrivateRoute';

const Login = (props: any) => {
  const router = useRouter();
  const textColor = useColorModeValue('black', 'white');
  const cardBgColor = useColorModeValue('gray.300', 'gray.700');

  const onCardClick = function (id?: string) {
    if (!id) return;
    router.push(`editor/${id}`);
  };

  return (
    <Container maxW={'container.xl'}>
      <VStack alignItems={'flex-start'} spacing={3}>
        <Heading
          color={textColor}
          marginBlockStart={5}
          fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}>
          Welcome {props.user?.displayName || props.user?.email}
        </Heading>
        <Text fontSize={{ base: 'small', sm: 'xl' }}>
          Here you can view your cards or you can{' '}
          <Button
            size={'sm'}
            colorScheme='whatsapp'
            onClick={() => router.push('/editor/new')}>
            {' '}
            Creat Card
          </Button>
        </Text>
      </VStack>

      <Divider maxW={'container.md'} marginBlockStart={3} />

      <Box
        p={{ base: 2, sm: 5, md: 10 }}
        bg={cardBgColor}
        marginBlockStart={7}
        rounded='2xl'>
        <Flex wrap={'wrap'} justifyContent='space-between' gap={5}>
          {props.userDataFromDb?.cards?.map((card: CardType) => (
            <Box
              flex='1'
              bg={'white'}
              borderRadius='lg'
              p={{ base: 2, sm: 6 }}
              key={card.id}>
              <Flex
                flexDirection={'column'}
                height='full'
                gap={5}
                alignItems='flex-start'
                justifyContent='space-between'>
                <VStack alignItems={'flex-start'} spacing={1}>
                  <Badge colorScheme={'facebook'}>{card.category}</Badge>
                  <Heading color={'black'} fontSize={'md'}>
                    {card.title}
                  </Heading>

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
};

export default PrivateRoute(Login);
