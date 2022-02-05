import type { NextPage } from 'next';
import React from 'react';
import styles from '../../styles/Home.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import reactStringReplacer from 'react-string-replace';
import { renderToString } from 'react-dom/server';

const TrainingCard = () => {
  const [cardHtml, setCardHtml] = React.useState<any>('');

  // TODO: move outside to getProps... and just pass the html as prop
  React.useEffect(() => {
    const codeAsString = `function(a:number){return user+ 2} <script>alert("hey")</script>`;
    const newHtml = reactStringReplacer(
      renderToString(
        <SyntaxHighlighter style={materialLight} language='typescript'>
          {codeAsString}
        </SyntaxHighlighter>
      ),
      'user',
      () => `<input type="text" placeholder="..."/>`
    );
    setCardHtml(newHtml);
  }, []);

  return (
    <div
      className={styles.card}
      dangerouslySetInnerHTML={{
        __html: cardHtml,
      }}></div>
  );
};

export default TrainingCard;
