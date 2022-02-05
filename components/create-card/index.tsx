import type { NextPage } from 'next';
import React from 'react';
import { renderToString } from 'react-dom/server';
import reactStringReplace from 'react-string-replace';
import styles from './create-card.module.css';

const getSelectionDirection = function (selection: any) {
  let position = selection.anchorNode.compareDocumentPosition(
      selection.focusNode
    ),
    backward = false;
  // position == 0 if nodes are the same
  if (
    (!position && selection.anchorOffset > selection.focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  )
    backward = true;

  return backward;
};
const CreateCard = () => {
  const cardFormRef = React.useRef<HTMLDivElement | null>(null);
  const textSelectedRef = React.useRef<string | null>('');
  const [cursorOffset, setCursorOffset] = React.useState(0);
  const [showMarker, setShowMarker] = React.useState(false);

  // selection change
  const onSelectionChanged = (e: Event) => {
    if (!document) return;
    const selection = document.getSelection()!;
    if (!selection) return;
    // select only the div with editor id
    if (selection!.anchorNode?.parentElement?.id != 'editor') return;
    const textSelection = selection!.toString();
    const rangeStart = selection?.getRangeAt(0);
    const cursorDirection = getSelectionDirection(selection);
    setCursorOffset(
      cursorDirection
        ? rangeStart.startOffset
        : (rangeStart?.endOffset as number)
    );

    textSelectedRef.current = textSelection;
    setShowMarker(textSelection.length > 0);
  };

  // marker click
  const onMarkerClick = function (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    e.stopPropagation();
    e.preventDefault();
    // use react-string replacer and replace the current html with span warper as selection
    textSelectedRef.current = null;
    setShowMarker(false);
  };

  React.useEffect(() => {
    if (!cardFormRef.current) return;
    document.addEventListener('selectionchange', onSelectionChanged);
    // clear selection when out of focus
    cardFormRef.current.addEventListener('focusout', function () {
      setShowMarker(false);
    });
    return () => {
      document.removeEventListener('selectionchange', onSelectionChanged);
    };
  }, [cardFormRef]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        contentEditable
        spellCheck={false}
        id='editor'
        role='textbox'
        ref={cardFormRef}
        className={styles.create_form}
        suppressContentEditableWarning></div>

      {showMarker && (
        <button
          onClick={onMarkerClick}
          type='button'
          style={{ left: cursorOffset * 10 - -10 }}
          className={styles.marker}>
          +
        </button>
      )}
    </div>
  );
};

export default CreateCard;
