import {
  Box,
  Flex,
  Container,
  List,
  ListItem,
  Button,
  Link,
  useColorMode,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useBreakpointValue
} from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import React from 'react';
import { useUser } from 'reactfire';
import classes from './navigation.module.scss';
import NextLink from 'next/link';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { GiMachete } from "react-icons/gi";
import CreateCard from './CreateCard';

const Navigation = () => {
  const auth = getAuth();
  const { data: user } = useUser();
  const { toggleColorMode, colorMode } = useColorMode();
  const DarkModeIcon = colorMode === 'dark' ? SunIcon : MoonIcon;
  const navigationBgColor = useColorModeValue("teal.300", "black");
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const mobileOrDesktopSize = useBreakpointValue({ base: "xs", sm: "sm" })

  const NavigationLinks = () => {
    return <Flex
      justifyContent={{ base: 'center', sm: 'space-between' }}
      wrap='wrap'
      alignItems='center'
      p={3}>

      <Flex gap={1}>
        <NextLink href={'/'}>
          <Link textDecoration={"underline"} color="white" fontSize={'xl'} className={classes.logo}>
            Machete
          </Link>
        </NextLink>
        <GiMachete color="white" />
      </Flex>


      <List>
        <Flex alignItems={"center"} gap={2}>
          {user && (
            <ListItem>
              <CreateCard />
            </ListItem>
          )}
          <ListItem>
            <Button
              size={mobileOrDesktopSize}
              onClick={() =>
                user ? signOut(auth) : router.push('/auth')
              }>
              {user ? 'Logout' : 'Login'}
            </Button>
          </ListItem>

          <IconButton aria-label='toggle light or dark mode' size={mobileOrDesktopSize} onClick={toggleColorMode} icon={<DarkModeIcon className={classes.darkModeToggle} />} />

        </Flex>
      </List>

    </Flex>
  }

  const DesktopNav = () => {
    return <Box
      as='nav'
      className={classes.Root}
      bgColor={navigationBgColor}
      position={"sticky"}
      top="0"
      zIndex={999}
    >
      <Container maxW={'container.xl'}>
        <NavigationLinks />
      </Container>
    </Box>
  }

  const MobileNav = () => {
    return <Box dir='rtl'>
      <IconButton size={"lg"} onClick={() => setDrawerOpen(true)} aria-label='open menue' icon={<HamburgerIcon />} />
      <Drawer placement={"top"} onClose={() => setDrawerOpen(false)} isOpen={drawerOpen}>
        <DrawerOverlay />
        <DrawerContent bg={navigationBgColor}>
          <DrawerBody>
            <NavigationLinks />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  }
  return mobileOrDesktopSize === "xs" ? <MobileNav /> : <DesktopNav />
};

export default Navigation;
