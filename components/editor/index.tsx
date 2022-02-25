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
import * as Types from './types';
import * as Utils from './editor-utils';
import * as CustomComponents from './custom-components';
import { withHistory } from 'slate-history';
import { HoveringToolbar } from './hovering-toolbar';
import { decorator } from "./editor.configs"
import * as Events from './editor-events';
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Types.CustomElement;
    Text: Types.CustomText;
    Descendant: Descendant & { type: string };
  }
}

const SlateEditor: React.FC<Types.EditorProps> = (props) => {
  const [editor] = React.useState(() => withHistory(withReact(createEditor())));
  const editorRef = React.useRef<null | HTMLDivElement>(null);
  const [allowTrain, setAllowTrain] = React.useState(false);
  const [editorCodeLang, setLanguage] = React.useState<Utils.CodeLanguages | null>(Utils.CodeLanguages.HTML);
  const [editorValue, setEditorValue] = React.useState(JSON.parse(props.card?.text) || CustomComponents.initialValue);
  const [mode, setMode] = React.useState<Utils.EditorMode>(
    Utils.EditorMode.ADD
  );


  // Each time we change code lang
  React.useEffect(() => {
    if (!editorValue?.[0] || !editorRef.current) return;
    // determine if we can be in training mode
    setAllowTrain(
      editorRef.current?.querySelectorAll('[data-selected]').length > 0
    );
    const detectCodeTimerId = setTimeout(() => Events.handelCreatCodeBlock(editor, setLanguage), 600);
    return () => {
      clearTimeout(detectCodeTimerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorValue]);

  // When we change the code lang.
  //TODO: Per Code BLOCK!
  React.useEffect(() => {
    if (!editorCodeLang) return
    // Transforms.insertNodes(editor, [
    //   {
    //     type: 'code',
    //     children: [{ text: '' }],
    //   },
    // ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorCodeLang]);


  // TODO: Per Code BLOCK!
  // decorate function depends on the language selected
  const decorate = React.useCallback(
    ([node, path]) => decorator([node, path], editorCodeLang),
    [editorCodeLang]
  );

  // TODO: Move to custom comp
  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = React.useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return (
          <CustomComponents.CodeElement {...props} />
        );
      default:
        return <CustomComponents.DefaultElement {...props} />;
    }
  }, []);



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
          onKeyDown={(event) => Events.handelKeyDown(event, editor)}
          renderLeaf={(props) => <CustomComponents.Leaf {...props} />}
        />
      </Slate>
      {/* TODO::  should be a EditorActionsButton components.*/}
      <button onClick={() => props.onSaveCard(JSON.stringify(editor.children), props.card.id)}> Save</button>
    </div >
  );
};

export default SlateEditor;


Prism.languages.typeScript = Prism.languages.extend('typescript', {});
