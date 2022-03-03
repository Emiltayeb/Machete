import '../styles/globals.css';
import type { AppProps } from 'next/app';
// 1. import `ChakraProvider` component
import { Box, ChakraProvider, Progress } from '@chakra-ui/react';
import Footer from '../components/layout/footer/Footer';
import { firebaseConfig } from '../services/firebase-config';
import { FirebaseAppProvider } from 'reactfire';
import FirebaseWrapper from '../components/layout/FirebaseWrapper';
import Head from 'next/head';
import Navigation from '../components/layout/navigation/Navigation';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseWrapper>
        <Head>
          <title>Machete</title>
        </Head>
        <RecoilRoot>
          <ChakraProvider>
            <Navigation />
            <Box minH={{ base: 'auto', sm: '90vh' }}>
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
