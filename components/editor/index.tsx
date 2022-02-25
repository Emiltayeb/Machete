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
  Element,
} from 'slate';

import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { DOMRange } from 'slate-react/dist/utils/dom';
import Marker from '../floating-marker';
import * as Types from './types';
import * as Utils from './utils';
import * as CustomComponents from './custom-components';
import { withHistory } from 'slate-history';
import clsx from 'clsx';
import { HoveringToolbar } from './hovering-toolbar';
import { transcode } from 'buffer';
const detectLang = require('lang-detector');

interface EditorProps {
  mode: 'training' | 'editing';
  onSaveCard: ({ text, id }: { text: string; id: number }) => void;
  card: { text: string; id: number };
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

const SlateEditor: React.FC<EditorProps> = (props) => {
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
  const [editorValue, setEditorValue] = React.useState(initialValue);

  const [mode, setMode] = React.useState<Utils.EditorMode>(
    Utils.EditorMode.ADD
  );

  React.useEffect(() => {
    rangeRef.current = document.createRange();
  }, []);

  React.useEffect(() => {
    if (!editorValue?.[0] || !editorRef.current) return;
    // determine if we can be in training mod
    setAllowTrain(
      editorRef.current?.querySelectorAll('[data-selected]').length > 0
    );
    const detectCodeTimerId = setTimeout(autoDetectEditorLang, 600);
    return () => {
      clearTimeout(detectCodeTimerId);
    };
  }, [editorValue]);

  React.useEffect(() => {
    Transforms.insertNodes(editor, [
      {
        type: 'code',
        children: [{ text: ' ' }],
      },
    ]);
  }, [editorCodeLang]);
  // decorate function depends on the language selected
  const decorate = React.useCallback(
    ([node, path]) => {
      const ranges: any = [];
      if (!Text.isText(node) as any) {
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
  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = React.useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return (
          <pre {...props.attributes}>
            <code>{props.children}</code>
          </pre>
        );
        break;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);
  const autoDetectEditorLang = function () {
    const block = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n),
    });

    if (block) {
      const [blockNode, path] = block;
      const codeRegex = blockNode?.children?.[0]?.text.match(/`{3}([a-z]*)/);
      if (codeRegex?.[1]) {
        editor.deleteBackward('word');
        setLanguage(codeRegex?.[1] as Utils.CodeLanguages);
      }
    }
  };

  return (
    <div ref={editorRef}>
      <Slate
        editor={editor}
        value={editorValue}
        onChange={(newValue) => {
          setEditorValue(newValue as any);
        }}>
        <HoveringToolbar />
        <Editable
          placeholder='Enter some text'
          decorate={decorate}
          id='SLATE_EDITOR'
          className={classes.editor}
          renderElement={renderElement}
          onKeyDown={(event) => {
            const { key, shiftKey } = event;
            if (shiftKey && key === 'Enter') {
              Transforms.insertNodes(editor, [
                {
                  type: 'block',
                  children: [{ text: ' ' }],
                },
              ]);
            }
          }}
          renderLeaf={(props) => <CustomComponents.Leaf {...props} />}
        />
      </Slate>
    </div>
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
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
      },
    ],
  },
];
