import {
  Box,
  Text,
  Flex,
  Container,
  List,
  ListItem,
  Button,
  Link,
  useColorMode,
  useColorModeValue,
  Progress,
} from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import React from 'react';
import { useUser } from 'reactfire';
import classes from './navigation.module.scss';
import NextLink from 'next/link';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoadingState } from '../../../store';

const Navigation = () => {
  const auth = getAuth();
  const { data: user } = useUser();
  const { toggleColorMode, colorMode } = useColorMode();
  const DarkModeIcon = colorMode === 'dark' ? SunIcon : MoonIcon;
  const textColor = useColorModeValue('facebook.500', 'white');
  const borderBottomColor = useColorModeValue('gray.200', 'gray.100');
  const loadingState = useRecoilValue(isLoadingState);
  const router = useRouter();

  return (
    <>
      <Box
        as='nav'
        className={classes.Root}
        borderBottomColor={borderBottomColor}>
        <Container maxW={'container.xl'}>
          <Flex
            justifyContent={{ base: 'center', sm: 'space-between' }}
            wrap='wrap'
            alignItems='center'
            p={6}>
            <NextLink href={'/'}>
              <Link color={textColor} fontSize={'xl'} className={classes.logo}>
                Machete
              </Link>
            </NextLink>
            <List>
              <Flex
                gap={4}
                alignItems='center'
                wrap='wrap'
                justifyContent={{ base: 'center', md: 'initial' }}>
                {user && (
                  <ListItem>
                    <Button colorScheme={'whatsapp'}>Create Card</Button>
                  </ListItem>
                )}
                <ListItem>
                  <Button
                    color={textColor}
                    onClick={() =>
                      user ? signOut(auth) : router.push('/auth')
                    }>
                    {user ? 'Logout' : 'Login'}
                  </Button>
                </ListItem>

                <ListItem as={Button} onClick={toggleColorMode}>
                  <DarkModeIcon className={classes.darkModeToggle} />
                </ListItem>
              </Flex>
            </List>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default Navigation;
