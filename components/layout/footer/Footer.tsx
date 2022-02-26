import { Box, Center, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import classes from './footer.module.scss';

const Footer: React.FC = () => {
  const borderColor = useColorModeValue('gray.300', 'white');
  return (
    <Center
      className={classes.Root}
      p={4}
      borderTopColor={borderColor}
      alignItems='center'>
      <Text fontSize={'sm'} fontWeight='semibold'>
        {' '}
        Built by Emil Tayeb ©
      </Text>

      <Text fontSize={'x-small'}>{new Date().toDateString()}</Text>
    </Center>
  );
};

export default Footer;
