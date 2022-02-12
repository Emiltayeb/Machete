import React, { useCallback } from 'react';
import classes from './editor.module.css';
import {
  BaseEditor,
  createEditor,
  Editor,
  Node,
  Transforms,
  Descendant,
} from 'slate';
import {
  Editable,
  ReactEditor,
  Slate,
  useSelected,
  withReact,
} from 'slate-react';
import { DOMRange } from 'slate-react/dist/utils/dom';
import Marker from '../floating-marker';
import * as Types from './types';
import * as Utils from './utils';
import * as CustomComponents from './custom-components';
import { withHistory } from 'slate-history';
import { setegid } from 'process';
import { Placeholder } from '@udecode/plate';

interface EditorProps {
  mode: 'training' | 'editing';
}
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Types.CustomElement;
    Text: Types.CustomText;
  }
}
const SlateEditor: React.FC<EditorProps> = () => {
  const [editor] = React.useState(() => withHistory(withReact(createEditor())));
  const [markerState, setMarkerState] = React.useState<Types.MarkerState>(null);
  const [currentWordRange, setCurrentWordRange] =
    React.useState<Types.CurrentWordRange>(null);
  const editorRef = React.useRef<null | HTMLDivElement>(null);
  const rangeRef = React.useRef<null | DOMRange>(null);
  const [allowTrain, setAllowTrain] = React.useState(false);
  const [editorValue, setEditorValue] = React.useState<null | Descendant[]>(
    null
  );
  const [mode, setMode] = React.useState<Utils.EditorMode>(
    Utils.EditorMode.ADD
  );

  React.useEffect(() => {
    rangeRef.current = document.createRange();
    // removing the marker when we click outside of the slat editor
    document.body.addEventListener('click', (e) =>
      Utils.handelMarkerBlur(e, setMarkerState)
    );

    // loading the value from whatever you want on initial load..
    setEditorValue(
      JSON.parse(localStorage?.getItem('editorValue')) ||
        Utils.initialEditorValue
    );
  }, []);

  // save editor value to db, determin if we can be in training mode and set relevant placeholder logic
  React.useEffect(() => {
    if (!editorValue || !editorRef.current) return;
    setAllowTrain(
      editorRef.current?.querySelectorAll('[data-selected]').length > 0
    );
    const { type, children } = editorValue?.[0];

    if (!children || children[0]?.text.length === 0) {
      localStorage.setItem(
        'editorValue',
        JSON.stringify(Utils.initialEditorValue)
      );

      return;
    }
    // no changes were yet made
    if (editor.history.undos.length === 0) return;
    if (type === 'placeHolder') {
      Transforms.removeNodes(editor);
      Transforms.insertNodes(editor, [
        {
          type: 'p',
          children: [{ text: editor.history.undos[0][0].text }],
        },
      ]);
    }

    localStorage.setItem('editorValue', JSON.stringify(editorValue));
  }, [editorValue]);

  const renderElement = React.useCallback((props) => {
    switch (props.element.type) {
      case 'placeHolder':
        return <CustomComponents.PlaceHolder {...props} />;
      default:
        return <CustomComponents.DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = React.useCallback(
    (props) => {
      if (props.leaf[Utils.Marks.MARKED_TEXT]) {
        if (mode === Utils.EditorMode.TRAIN) {
          return <CustomComponents.TrainingInput {...props} />;
        }
        return (
          <CustomComponents.RememberText
            {...props}
            onClick={(e) =>
              Utils.handelRemoveSelection(e, setMarkerState, rangeRef)
            }
          />
        );
      }
      return <CustomComponents.Leaf {...props} />;
    },
    [mode]
  );

  return editorValue ? (
    <div ref={editorRef}>
      <Slate
        editor={editor}
        value={editorValue}
        onChange={(newValue) => setEditorValue(newValue as any)}>
        <Editable
          readOnly={mode === Utils.EditorMode.TRAIN}
          id='SLATE_EDITOR'
          className={classes.editor}
          onSelect={(e) => {
            if (mode === Utils.EditorMode.ADD) {
              Utils.onSelectionChanged(
                e,
                setMarkerState,
                editor,
                setCurrentWordRange
              );
            }
          }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}></Editable>
      </Slate>

      {markerState && (
        <Marker
          onMarkerClick={(e: any) =>
            Utils.onMarkerClick(
              e,
              editor,
              currentWordRange,
              setMarkerState,
              markerState
            )
          }
          markerState={markerState}
        />
      )}

      <div className={classes.actions}>
        <button
          disabled={!allowTrain}
          onClick={() => setMode(Utils.EditorMode.TRAIN)}
          className={mode === Utils.EditorMode.TRAIN ? classes.active : ''}>
          Train
        </button>
        <button
          className={mode === Utils.EditorMode.ADD ? classes.active : ''}
          onClick={() => setMode(Utils.EditorMode.ADD)}>
          Edit
        </button>
      </div>
    </div>
  ) : (
    'loading..'
  );
};

export default SlateEditor;
