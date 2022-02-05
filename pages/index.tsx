import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import TrainingCard from '../components/training-card';
import CreateCard from '../components/create-card';

// user code

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
        <h3>Training card</h3>
        <TrainingCard />
        <h3>Create card</h3>
        <CreateCard />
      </main>

      <footer className='footer'>
        <p>Built by Emil Tayeb ©</p>
      </footer>
    </div>
  );
};

export default Home;
