import React from 'react';
import styles from './create-card.module.css';
import {
  createEditor,
  BaseEditor,
  Transforms,
  Text,
  Range,
  Editor,
} from 'slate';
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react';
import { FloatingMenu } from '../floating-marker';
import { DOMRange } from 'slate-react/dist/utils/dom';

type CustomElement = { type: any; children: any };
type CustomText = { text: any };
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// custom elements
const Leaf = (props: any) => {
  return (
    <span {...props.attributes} data-selected={props.leaf.selected}>
      {props.children}
    </span>
  );
};

const DefaultElement = (props: any) => {
  return <span {...props.attributes}>{props.children}</span>;
};

// Helpers

const getOffset = function (selection: any) {
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

  const offset = !backward
    ? selection.focusOffset - selection.anchorOffset
    : selection.anchorOffset - selection.focusOffset;
  return offset;
};

// Main
const CreateCard = () => {
  const [editor] = React.useState(() => withReact(createEditor()));
  const [markerState, setMarkerState] = React.useState<{
    directions: DOMRect;
    offset: number;
    functionality?: 'add' | 'remove';
    node?: any;
  } | null>(null);
  const [currentWordRange, setCurrentWordRange] = React.useState<
    (Range & { word: string | undefined }) | null
  >(null);
  const rangeRef = React.useRef<null | DOMRange>(null);

  const [value, setValue] = React.useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);

  // removing the marker when we click outside of the slat eeditor
  React.useEffect(() => {
    rangeRef.current = document.createRange();
    document.body.addEventListener(
      'click',
      (e) => {
        if (!e.target) return;
        const node = e.target as HTMLSpanElement;
        const el = node.closest('div');
        if (!el) return;
        if (
          el.dataset.slateEditor === 'true' ||
          el.dataset.editorMarker === 'true'
        )
          return;
        setMarkerState(null);
      },
      true
    );

    return;
  }, []);

  const handleInsertWord = (index?: number) => {
    if (!currentWordRange) return;
    Transforms.insertNodes(
      editor,
      { type: 'rememberThis', children: [{ text: currentWordRange.word }] },
      {
        at: currentWordRange,
        voids: true,
      }
    );
    setMarkerState(null);
  };

  // selection change
  const onSelectionChanged = (e: React.MouseEvent<any>) => {
    e.preventDefault();

    // setting cursor position to open marker
    const sel = window.getSelection();
    const textSelected = sel?.toString();

    const parent = sel?.anchorNode?.parentElement?.closest(`[data-selected]`);

    if (!sel || sel.rangeCount === 0 || textSelected?.length < 2) {
      setMarkerState(null);
      return;
    }

    if (parent?.textContent === textSelected) {
      // the user selected the exact same text. offer do delete?
      console.log('delete?');
    }

    const offset = getOffset(sel);
    const direction = sel.getRangeAt(0).getBoundingClientRect();
    const range = sel.getRangeAt(0);

    // if the user selection includes selected word - we soulhd merge it
    if (
      Array.from(range.cloneContents().childNodes).some((child) => {
        if (child instanceof HTMLElement) {
          return child.getAttribute('data-selected') === 'true';
        }
      })
    ) {
      console.log('included!');
    }
    if (!editor.selection?.anchor || !editor.selection.focus) return;
    setCurrentWordRange({
      anchor: {
        path: editor.selection.anchor.path,
        offset: sel.anchorOffset,
      },
      focus: {
        path: editor.selection.focus.path,
        offset: sel.focusOffset,
      },
      word: textSelected,
    });

    setMarkerState({ directions: direction, offset, functionality: 'add' });
  };

  //marker click
  const onMarkerClick = function (e: React.MouseEvent<any>) {
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (markerState?.functionality === 'add') {
      handleInsertWord();
    } else if (markerState?.functionality === 'remove') {
      Transforms.removeNodes(editor);
      Transforms.insertText(editor, markerState.node.textContent);
      // Transforms.unwrapNodes(editor, { at: currentWordRange });
    }
    setMarkerState(null);
  };

  // remove selection
  const handelRemoveSelection = function (
    e: React.MouseEvent<HTMLSpanElement>
  ) {
    const node = e.target as HTMLElement;
    setMarkerState({
      directions: node.getBoundingClientRect(),
      offset: 0,
      functionality: 'remove',
      node,
    });

    rangeRef.current?.selectNode(node.lastChild);
  };
  const renderElement = React.useCallback((props) => {
    switch (props.element.type) {
      case 'rememberThis':
        return (
          <span
            {...props.attributes}
            onClick={handelRemoveSelection}
            data-selected='true'
            className={styles.marked_text}>
            {props.children}
          </span>
        );

      case 'training':
        return <input type='text' name='' id='' {...props.attributes} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = React.useCallback((props) => {
    console.log('rendering leaf..', props);
    if (props.leaf.text.length === 0) return <></>;
    return <Leaf {...props} />;
  }, []);

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue as any)}>
        <Editable
          id='SLATE_EDITOR'
          className={styles.editor}
          onSelect={onSelectionChanged}
          renderElement={renderElement}
          renderLeaf={renderLeaf}></Editable>
      </Slate>
      {markerState && (
        <FloatingMenu onMarkerClick={onMarkerClick} markerState={markerState} />
      )}
    </>
  );
};

export default CreateCard;
