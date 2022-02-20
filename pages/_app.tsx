import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Container from '../components/layout/Container';
import Footer from '../components/layout/Footer';
import { firebaseConfig } from '../utils/firebase-config';
import { FirebaseAppProvider } from 'reactfire';
import FirebaseWrapper from '../utils/FirebaseWrapper';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseWrapper>
        <Container>
          <Component {...pageProps} />
        </Container>
        <Footer />
      </FirebaseWrapper>
    </FirebaseAppProvider>
  );
}

export default MyApp;
