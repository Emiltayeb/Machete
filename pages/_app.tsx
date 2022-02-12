import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Container from '../components/layout/Container';
import Footer from '../components/layout/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Container>
        <Component {...pageProps} />
      </Container>
      <Footer />
    </>
  );
}

export default MyApp;
