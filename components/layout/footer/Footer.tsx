import { Box, Center, Text, useColorModeValue, Link, HStack } from '@chakra-ui/react';
import React from 'react';
import classes from './footer.module.scss';
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai"

const Footer: React.FC = () => {
  const borderColor = useColorModeValue('gray.300', 'white');
  return (
    <Center
      flexDirection={"column"}
      textAlign={"center"}
      w={"full"}
      className={classes.Root}
      p={2}
      borderTopColor={borderColor}
    >
      <Text fontSize={'sm'} fontWeight='semibold'>
        Built by Emil Tayeb ©
      </Text>
      <Text fontSize={'x-small'}>{new Date().toDateString()}</Text>
      <Box>
        <HStack>
          <Link isExternal href='https://github.com/Emiltayeb'>
            <AiFillGithub />
          </Link>
          <Link isExternal href='https://www.linkedin.com/in/emil-tayeb/'>
            <AiFillLinkedin />
          </Link>
        </HStack>
      </Box>
    </Center>
  );
};

export default Footer;
