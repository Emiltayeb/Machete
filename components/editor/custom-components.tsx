import React from 'react';
import classes from './editor.module.scss';
import { css } from '@emotion/css';
import { Descendant, Editor } from 'slate';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { prependOnceListener } from 'process';

// initial editor values (new user - no cards)
export const initialValue: Descendant[] = [
  {
    type: 'placeholder',
    children: [
      {
        text: 'Write something once. remember it forever.',
      },
    ],
  },
];



const CodeCss = (leaf: any) =>
  `
    
      ${leaf.property
      ? css`
              color: var(--green-6);
            `
      : ''
    } 
        ${leaf.builtin
      ? css`
                color: var(--green-6);
              `
      : ''
    }
        ${leaf.operator || leaf.url
      ? css`
                color: #9a6e3a;
              `
      : ''
    }
        ${leaf.keyword
      ? css`
                color: #07a;
              `
      : ''
    }
        ${leaf.variable || leaf.regex
      ? css`
                color: #e90;
              `
      : ''
    }
        ${leaf.number ||
      leaf.boolean ||
      leaf.tag ||
      leaf.constant ||
      leaf.symbol ||
      leaf['attr-name'] ||
      leaf.selector
      ? css`
                color: #905;
              `
      : ''
    }
        ${leaf.punctuation
      ? css`
                color: #999;
              `
      : ''
    }
        ${leaf.string || leaf.char
      ? css`
                color: #690;
              `
      : ''
    }
        ${leaf.function || leaf['class-name']
      ? css`
                color: #dd4a68;
              `
      : ''
    }
    `.trim();


// Elements - basically a block
export const CodeElement = (props: any) => {
  return <pre {...props.attributes}>
    {props.children}
  </pre>
}

export const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>
}

// leaf - is text node
export const Leaf = ({ attributes, children, leaf }: any) => {

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  if (leaf.marker) {
    children = <span className={classes.marker}>{children}</span>;
  }

  if (leaf.rememberText) {
    children = <span className={classes.rememberText}>{children}</span>;
  }



  return (
    <span {...attributes} className={CodeCss(leaf)}>
      {children}
    </span>
  );
};

// Handel the training input.
export const TrainingInput = (props: any) => {
  const [answerStatus, setAnswerStatus] = React.useState({
    answered: false,
    status: false,
  });
  const [inputState, setInputState] = React.useState<string>('');
  React.useEffect(() => {
    // add on enter event
    return () => { };
  }, []);

  const handelSubmit = function (e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.shiftKey && e.key === 'Enter') {
      console.log('line break');
      return;
    }
    if (e.key !== 'Enter') return;
    console.log(Editor);
    const correctText = props.leaf.text.trim();
    setAnswerStatus({ status: inputState === correctText, answered: true });
  };

  return (
    <span
      {...props.attributes}
      onKeyPress={handelSubmit}
      className={classes.training_card}>
      <span style={{ userSelect: 'none' }} contentEditable={false}>
        <input
          data-answered={answerStatus.answered}
          data-correct={answerStatus.status}
          placeholder='...'
          type='text'
          value={inputState}
          style={{
            width: `${inputState.length}ch`,
          }}
          onChange={(e) =>
            !answerStatus.answered && setInputState(e.target.value)
          }
          className={classes.train_input}
        />
      </span>
    </span>
  );
};
