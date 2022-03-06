import { Heading, VStack, Text, Container, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';

const NotFound = () => {
  return (
    <Container maxW={'container.md'} p={3}>
      <VStack alignItems={'flex-start'} spacing={4}>
        <Heading>Ops.. you got lost.</Heading>
        <Text>
          But were here to help you find your way{' '}
          <NextLink href={'/'}>
            <Link color={'facebook.400'}>Home</Link>
          </NextLink>
        </Text>
      </VStack>
    </Container>
  );
};

export default NotFound;
