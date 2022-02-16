import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';

import classes from './editor.module.scss';
import {
  BaseEditor,
  createEditor,
  Transforms,
  Descendant,
  Editor,
  Text,
} from 'slate';

import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { DOMRange } from 'slate-react/dist/utils/dom';
import Marker from '../floating-marker';
import * as Types from './types';
import * as Utils from './utils';
import * as CustomComponents from './custom-components';
import { withHistory } from 'slate-history';
const detectLang = require('lang-detector');

interface EditorProps {
  mode: 'training' | 'editing';
}
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Types.CustomElement;
    Text: Types.CustomText;
    Descendant: Descendant & { type: string };
  }
}

console.clear();

const SlateEditor: React.FC<EditorProps> = () => {
  const [editor] = React.useState(() => withHistory(withReact(createEditor())));
  const [markerState, setMarkerState] = React.useState<Types.MarkerState>(null);
  const [currentWordRange, setCurrentWordRange] =
    React.useState<Types.CurrentWordRange>(null);
  const editorRef = React.useRef<null | HTMLDivElement>(null);
  const rangeRef = React.useRef<null | DOMRange>(null);
  const markerVisibleREf = React.useRef<boolean>(false);
  const [allowTrain, setAllowTrain] = React.useState(false);
  const [editorCodeLang, setLanguage] = React.useState(
    Utils.CodeLanguages.HTML
  );
  const [editorValue, setEditorValue] = React.useState<null | Descendant[]>(
    null
  );

  const [mode, setMode] = React.useState<Utils.EditorMode>(
    Utils.EditorMode.ADD
  );

  React.useEffect(() => {
    rangeRef.current = document.createRange();

    // loading the value from whatever you want on initial load..
    try {
      const dbStorage = JSON.parse(
        localStorage?.getItem('editorValue') as string
      );
      if (!dbStorage) throw Error;
      setEditorValue(dbStorage);
    } catch (error) {
      setEditorValue(Utils.placeHolerElement);
    }
  }, []);

  React.useEffect(() => {
    if (!editorValue?.[0] || !editorRef.current) return;

    // current element
    const { children } = editorValue?.[0] as any;

    // determine if we can be in training mod
    setAllowTrain(
      editorRef.current?.querySelectorAll('[data-selected]').length > 0
    );

    if (children?.[0].text?.length === 0) {
      //  console.log('you cant save..');
    }

    if (Utils.getEditorText(editor.children).length === 0) {
      // save editor value to db
      localStorage.setItem(
        'editorValue',
        JSON.stringify(Utils.placeHolerElement)
      );
      return;
    }

    const detectCodeTimerId = setTimeout(autoDetectEditorLang, 200);

    localStorage.setItem('editorValue', JSON.stringify(editorValue));

    return () => {
      clearTimeout(detectCodeTimerId);
    };
  }, [editorValue]);

  const renderElement = React.useCallback(
    (props) => {
      switch (props.element.type) {
        case 'placeHolder':
          return <CustomComponents.PlaceHolder {...props} />;
        default:
          return (
            <CustomComponents.DefaultElement
              {...props}
              editorTextType={Utils.EditorTextType.CODE}
            />
          );
      }
    },
    [mode]
  );

  const renderLeaf = React.useCallback(
    (props) => {
      if (props.leaf[Utils.Marks.MARKED_TEXT]) {
        if (mode === Utils.EditorMode.TRAIN) {
          return <CustomComponents.TrainingInput {...props} />;
        }
        return (
          <CustomComponents.RememberText
            {...props}
            onClick={(e: any) =>
              Utils.handelRemoveSelection(e, setMarkerState, rangeRef)
            }
          />
        );
      }
      return (
        <CustomComponents.Leaf
          {...props}
          editorTextType={Utils.EditorTextType.CODE}
        />
      );
    },
    [mode]
  );
  // decorate function depends on the language selected
  const decorate = React.useCallback(
    ([node, path]) => {
      const ranges: any = [];

      if ((!Text.isText(node) as any) || node[Utils.Marks.MARKED_TEXT]) {
        return ranges;
      }

      const tokens = Prism.tokenize(node.text, Prism.languages[editorCodeLang]);
      let start = 0;

      for (const token of tokens) {
        const length = getLength(token);
        const end = start + length;

        if (typeof token !== 'string') {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          });
        }

        start = end;
      }

      return ranges;
    },
    [editorCodeLang]
  );

  const autoDetectEditorLang = function () {
    const editorText = Utils.getEditorText(editor.children).trim();

    let newLang = detectLang(editorText) as string;

    if (/([a-zA-z1-9]:)|(type.\w)|(interface).\w/gim.test(editorText)) {
      newLang = 'typescript';
    }
    if (!Utils.CodeLanguages[newLang.toLocaleUpperCase()]) {
      newLang = 'plaintext';
    }

    setLanguage(newLang.toLocaleLowerCase() as Utils.CodeLanguages);
  };
  return editorValue ? (
    <div ref={editorRef}>
      <Slate
        editor={editor}
        value={editorValue}
        onChange={(newValue) => {
          const children = editor.children[0] as any;
          if (children?.type === 'placeHolder') {
            Transforms.select(editor, {
              anchor: Editor.start(editor, []),
              focus: Editor.end(editor, []),
            });
            Transforms.delete(editor);
            Transforms.setNodes(editor, { type: 'p' });
          }
          setEditorValue(newValue as any);
        }}>
        <Editable
          decorate={decorate}
          readOnly={mode === Utils.EditorMode.TRAIN}
          id='SLATE_EDITOR'
          className={classes.editor}
          onKeyDown={(event) => {
            switch (event.key) {
              case 'a':
                event.ctrlKey &&
                  Transforms.select(editor, {
                    anchor: Editor.start(editor, []),
                    focus: Editor.end(editor, []),
                  });
                break;
              case 'Escape':
                setMarkerState(null);
                Transforms.select(editor, {
                  anchor: Editor.end(editor, []),
                  focus: Editor.end(editor, []),
                });
                break;
              default:
                break;
            }
          }}
          onSelect={(e) => {
            mode === Utils.EditorMode.ADD &&
              Utils.onSelectionChanged(
                e,
                setMarkerState,
                editor,
                setCurrentWordRange,
                markerVisibleREf
              );
          }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}></Editable>
      </Slate>

      {markerState && (
        <Marker
          onMarkerClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            Utils.onMarkerClick(
              e,
              editor,
              currentWordRange,
              setMarkerState,
              markerState
            );
            setCurrentWordRange(null);
          }}
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
    <p>Loading..</p>
  );
};

export default SlateEditor;

const getLength = (token: any) => {
  if (typeof token === 'string') {
    return token.length;
  } else if (typeof token.content === 'string') {
    return token.content.length;
  } else {
    return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
  }
};

Prism.languages.typeScript = Prism.languages.extend('typescript', {});
