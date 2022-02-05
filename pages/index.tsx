import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import reactStringReplacer from 'react-string-replace';

const codeString = `function(a:number){return user+ 2}`;

const card = reactStringReplacer(codeString, 'user', (match, i) => (
  <div className={styles.user_input}>
    <input type='text' />
  </div>
));

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>LearnEz</title>
        <meta name='description' content='A learning tool for everyone.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1>LearnEz POC</h1>

        <div className={styles.card}>
          {card.map((el, i) => {
            if (typeof el === 'string')
              return (
                <SyntaxHighlighter
                  key={i}
                  customStyle={{ margin: 0 }}
                  language='typescript'>
                  {el}
                </SyntaxHighlighter>
              );
            return el;
          })}
        </div>
      </main>

      <footer className='footer'>
        <p>Built by Emil Tayeb ©</p>
      </footer>
    </div>
  );
};

export default Home;
