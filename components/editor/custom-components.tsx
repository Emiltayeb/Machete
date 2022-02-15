import React from 'react';
import clsx from 'clsx';
import classes from './editor.module.scss';
export const Leaf = (props: any) => {
  return (
    <span {...props.attributes} data-selected={props.leaf.selected}>
      {props.children}
    </span>
  );
};

export const TrainingInput = (props: any) => {
  const [answerStatus, setAnswerStatus] = React.useState({
    answered: false,
    status: false,
  });
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    // add on enter event
    return () => {
      console.log('un mount');
    };
  }, []);

  const handelSubmit = function (e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key !== 'Enter') return;
    const userText = inputRef.current?.value;
    const correctText = props.leaf.text.trim();
    setAnswerStatus({ status: userText === correctText, answered: true });
  };

  return (
    <span
      {...props.attributes}
      onKeyPress={handelSubmit}
      className={classes.training_card}>
      <span
        style={{ userSelect: 'none' }}
        data-answered={answerStatus.answered}
        data-correct={answerStatus.status}
        contentEditable={false}>
        {answerStatus.answered ? (
          <span>{props.leaf.text}</span>
        ) : (
          <input
            placeholder='...'
            type='text'
            ref={inputRef}
            style={{ maxWidth: `${props.leaf.text.length * 3.5 + 25}px` }}
            className={classes.train_input}
          />
        )}
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
