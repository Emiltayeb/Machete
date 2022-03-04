import React from 'react';
import classes from './editor.module.scss';
import { css } from '@emotion/css';
import { Descendant, Editor, Transforms, Text } from 'slate';
import { EditorMode, selectCurrentNode } from './editor-utils';
import { Input } from '@chakra-ui/react';

// initial editor values (new user - no cards)
export const initialValue: Descendant[] = [
  {
    type: 'block',
    children: [{ text: '' }],
  },
];

const CodeCss = (leaf: any) =>
  `${leaf.comment
      ? css`
          color: slategray;
        `
      : ''
    }
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
  return <pre {...props.attributes}>{props.children}</pre>;
};

export const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

// leaf - is text node
export const Leaf = (props: any) => {
  let { attributes, children, leaf, editorMode, editor } = props;

  if (leaf.bold) {
    children = (
      <strong
        data-slate-custom-leaf='true'
        onClick={() => selectCurrentNode(editor)}>
        {children}
      </strong>
    );
  }

  if (leaf.marker) {
    children = (
      <span
        data-slate-custom-leaf='true'
        className={classes.marker}
        onClick={() => selectCurrentNode(editor)}>
        {children}
      </span>
    );
  }

  if (leaf.rememberText) {
    children =
      editorMode === EditorMode.TRAIN ? (
        <TrainingInput {...props} />
      ) : (
        <span
          data-slate-custom-leaf='true'
          data-remember-text='true'
          className={classes.rememberText}
          onClick={() => selectCurrentNode(editor)}>
          {children}
        </span>
      );
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
      return;
    }
    if (e.key !== 'Enter') return;
    const correctText = props.leaf.text.trim();
    setAnswerStatus({ status: inputState === correctText, answered: true });
  };

  return (
    <span
      {...props.attributes}
      onKeyPress={handelSubmit}
      className={classes.training_card}>
      <span style={{ userSelect: 'none' }} contentEditable={false}>
        <Input
          bg={'linkedin.400'}
          autoFocus
          pl={3}
          data-answered={answerStatus.answered}
          data-correct={answerStatus.status}
          placeholder='...'
          type='text'
          value={inputState}
          style={{
            width: `${inputState.length + 2}ch`,
            height: 'auto',
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
