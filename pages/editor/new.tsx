import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Editor from '../../components/editor';
import useGetData from '../../utils/useGetData';
import { doc, updateDoc, where } from 'firebase/firestore';
import { useUser } from 'reactfire';
import { v4 } from 'uuid';
import { CardType } from '../../components/editor/types';
import {
  Container,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import PrivateRoute from '../../components/PrivateRoute';

const Home = (props: any) => {
  const textColor = useColorModeValue("teal.700", "white")
  return (
    <Container maxW={'container.lg'} p={4}>
      <Head>
        <title>Machete - Create card</title>
        <meta name='description' content='A learning tool for everyone.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <VStack alignItems={'stretch'} spacing={3}>
        <VStack alignItems={'flex-start'} spacing={1}>
          <Heading color={textColor}>Create card</Heading>
          <Text>Here you can creat a memory card and save it.</Text>
        </VStack>
        <Editor mode='editing' {...props} />
      </VStack>
    </Container>
  );
};

export default PrivateRoute(Home);
