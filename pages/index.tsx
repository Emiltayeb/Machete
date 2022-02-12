import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import Editor from '../components/editor';

// user code

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>LearnEz</title>
        <meta name='description' content='A learning tool for everyone.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h3>Create card</h3>
      <Editor mode='editing' />
    </>
  );
};

export default Home;
