import React from 'react';
import classes from './editor.module.scss';
import { css } from '@emotion/css';
import { EditorTextType } from './utils';
import { Editor } from 'slate';
const CodeCss = (props: any) =>
  `
    
      ${
        props.leaf.property
          ? css`
              color: var(--green-6);
            `
          : ''
      } 
        ${
          props.leaf.builtin
            ? css`
                color: var(--green-6);
              `
            : ''
        }
        ${
          props.leaf.operator || props.leaf.url
            ? css`
                color: #9a6e3a;
              `
            : ''
        }
        ${
          props.leaf.keyword
            ? css`
                color: #07a;
              `
            : ''
        }
        ${
          props.leaf.variable || props.leaf.regex
            ? css`
                color: #e90;
              `
            : ''
        }
        ${
          props.leaf.number ||
          props.leaf.boolean ||
          props.leaf.tag ||
          props.leaf.constant ||
          props.leaf.symbol ||
          props.leaf['attr-name'] ||
          props.leaf.selector
            ? css`
                color: #905;
              `
            : ''
        }
        ${
          props.leaf.punctuation
            ? css`
                color: #999;
              `
            : ''
        }
        ${
          props.leaf.string || props.leaf.char
            ? css`
                color: #690;
              `
            : ''
        }
        ${
          props.leaf.function || props.leaf['class-name']
            ? css`
                color: #dd4a68;
              `
            : ''
        }
    `.trim();
export const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      data-selected={props.leaf.selected}
      className={
        props.editorTextType === EditorTextType.CODE ? CodeCss(props) : ''
      }>
      {props.children}
    </span>
  );
};

export const TrainingInput = (props: any) => {
  const [answerStatus, setAnswerStatus] = React.useState({
    answered: false,
    status: false,
  });
  const [inputState, setInputState] = React.useState<string>('');
  React.useEffect(() => {
    // add on enter event
    return () => {};
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

export const RememberText = (props: any) => {
  return (
    <span
      {...props.attributes}
      data-identifier={props.leaf.identifier}
      onClick={props.onClick}
      data-selected='true'
      className={classes.marked_text}>
      {props.children}
    </span>
  );
};

export const PlaceHolder = (props: any) => {
  return (
    <span {...props.attributes}>
      <span className={classes.placeHolder} style={{ pointerEvents: 'none' }}>
        {props.children}
      </span>
    </span>
  );
};
export const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};
