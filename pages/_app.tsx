import '../styles/globals.css';
import type { AppProps } from 'next/app';
// 1. import `ChakraProvider` component
import { Box, ChakraProvider, extendTheme, useColorModeValue } from '@chakra-ui/react';
import Footer from '../components/layout/footer/Footer';
import { firebaseConfig } from '../services/firebase-config';
import { FirebaseAppProvider } from 'reactfire';
import FirebaseWrapper from '../components/layout/FirebaseWrapper';
import Head from 'next/head';
import Navigation from '../components/layout/navigation/Navigation';
import OffLineModal from '../components/OfflineModal';
import { RecoilRoot } from 'recoil';


function MyApp({ Component, pageProps }: AppProps) {

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseWrapper>
        <Head>
          <title>Machete</title>
        </Head>

        <RecoilRoot>
          <ChakraProvider >
            <OffLineModal />
            <Navigation />
            <Box height={{ base: "unset", sm: "100vh" }} minHeight={{ base: "unset", sm: "100vh" }} >
              <Component {...pageProps} />
            </Box>
            <Footer />
          </ChakraProvider>
        </RecoilRoot>

      </FirebaseWrapper>
    </FirebaseAppProvider>
  );
}

export default MyApp;
