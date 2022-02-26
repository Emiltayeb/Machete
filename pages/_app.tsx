import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Container from '../components/layout/Container';
import Footer from '../components/layout/Footer';
import { firebaseConfig } from '../services/firebase-config';
import { FirebaseAppProvider } from 'reactfire';
import FirebaseWrapper from '../components/layout/FirebaseWrapper';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseWrapper>
        <Head>
          <title>Machete</title>
        </Head>
        <Container>
          <Component {...pageProps} />
        </Container>
        <Footer />
      </FirebaseWrapper>
    </FirebaseAppProvider>
  );
}

export default MyApp;
