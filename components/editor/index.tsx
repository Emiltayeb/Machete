import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import classes from './editor.module.scss';
import { BaseEditor, createEditor, Descendant } from 'slate';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import * as Types from './types';
import * as Utils from './editor-utils';
import * as CustomComponents from './custom-components';
import { withHistory } from 'slate-history';
import { HoveringToolbar } from './hovering-toolbar';
import { decorator } from './editor.configs';
import * as Events from './editor-events';
import { Box, Button, HStack, useToast } from '@chakra-ui/react';
import { doc, where } from 'firebase/firestore';
import { useUser } from 'reactfire';
import useGetData from '../../utils/useGetData';
import EditorActions from './editor-actions';

const SLATE_EDITOR_ID = 'SLATE_EDITOR';
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Types.CustomElement;
    Text: Types.CustomText;
    Descendant: Descendant & { type: string };
  }
}

const SlateEditor: React.FC<Types.EditorProps> = (props) => {
  const editor = React.useMemo(
    () => withHistory(withReact(createEditor())),
    []
  );
  const [editorCodeLang, setLanguage] = React.useState<
    Utils.CodeLanguages[] | null
  >(props?.card?.codeLanguages || [Utils.CodeLanguages.PLAIN_TEXT]);
  const [editorValue, setEditorValue] = React.useState(
    props.card ? JSON.parse(props.card?.text) : CustomComponents.initialValue
  );
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const [hideToolbar, setHideToolbar] = React.useState(false);

  const [editorMode, setEditorMode] = React.useState<Utils.EditorMode>(
    Utils.EditorMode.ADD
  );

  const [allowTrain, setAllowTRain] = React.useState(false);

  const { data: user } = useUser();
  const { resultData: userDataFromDb, db } = useGetData({
    dataBaseName: 'users',
    options: [where('email', '==', user?.email ?? '')],
  });

  const onCardSave = React.useCallback(
    async ({
      title,
      exec,
      category,
    }: {
      title: string;
      category: string;
      exec?: string;
    }) => {
      await Events.onCardSave(
        {
          text: JSON.stringify(editor.children),
          codeLanguages: editorCodeLang,
          id: props?.card?.id,
          category,
          title,
          exec,
        },
        userDataFromDb,
        db
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editorCodeLang, userDataFromDb]
  );

  console.log(allowTrain);
  // Each time we change the editor value
  React.useEffect(() => {
    if (!editorValue?.[0]) return;
    setAllowTRain(!!document.querySelector('[data-remember-text]'));
    const detectCodeTimerId = setTimeout(
      () => Events.handelCreatCodeBlock(editor, setLanguage),
      600
    );
    return () => {
      clearTimeout(detectCodeTimerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorValue]);

  // for every lang we have in the editor - paint it.
  const decorate = React.useCallback(
    ([node, path]) => {
      if (!editorCodeLang) return;
      let finalDecorator: any = [];
      editorCodeLang?.forEach((lang) => {
        const dec = decorator([node, path], lang, editor);
        finalDecorator.push(...dec);
      });

      return finalDecorator;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editorCodeLang]
  );

  const renderElement = React.useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return <CustomComponents.CodeElement {...props} />;
      default:
        return <CustomComponents.DefaultElement {...props} />;
    }
  }, []);

  return (
    <div ref={editorRef}>
      <Slate editor={editor} value={editorValue} onChange={setEditorValue}>
        <HoveringToolbar
          shouldHide={hideToolbar}
          setShouldHide={setHideToolbar}
        />
        <Editable
          tabIndex={1}
          autoFocus
          readOnly={editorMode === Utils.EditorMode.TRAIN}
          style={{ color: 'black' }}
          onBlur={() => setHideToolbar(true)}
          placeholder='Enter some text'
          decorate={decorate}
          id={SLATE_EDITOR_ID}
          className={classes.editor}
          renderElement={renderElement}
          onPaste={(event) => {
            event.preventDefault();
            const text = event.clipboardData.getData('Text');
            editor.insertText(text);
          }}
          onKeyDown={(event) => Events.handelKeyDown(event, editor)}
          renderLeaf={(props) => (
            <CustomComponents.Leaf
              {...props}
              editorMode={editorMode}
              editor={editor}
            />
          )}
        />
      </Slate>

      <EditorActions
        allowTrain={allowTrain}
        editorMode={editorMode}
        onCardSave={onCardSave}
        setEditorMode={setEditorMode}
        card={props.card}
      />
    </div>
  );
};

export default SlateEditor;
Prism.languages.typeScript = Prism.languages.extend('typescript', {});
