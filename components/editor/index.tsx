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
import * as CustomComponents from './custom-slate-elemnts';
import { withHistory } from 'slate-history';
import { HoveringToolbar } from './hovering-toolbar';
import * as Events from './editor-events';
import EditorActions from './editor-actions';
import { useRouter } from 'next/router';
import EditorOptions from './editor-options';
import { Badge, Box, Heading, HStack, Modal, Text as ChakraText, useColorModeValue } from '@chakra-ui/react';
import withImages from './with-image';
import { isMobile } from '../../utils';
import withLinks from './with-links';

export const SLATE_EDITOR_ID = 'SLATE_EDITOR';
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Types.CustomElement;
    Text: Types.CustomText;
    Descendant: Descendant & { type: string };
  }
}

// TODO: Image element with shift + enter

const CurrentCardInformation = function (props: { card?: Types.CardType | null }) {
  const textColor = useColorModeValue("black", "white")
  const bgColor = useColorModeValue("gray.200", "black")
  if (!props.card) return <></>
  return <Box p={2} color={textColor} bg={bgColor} marginBlockEnd={4}>
    <HStack alignItems={"center"} spacing={2} flexWrap={"wrap"}>
      <Badge colorScheme={'facebook'} fontSize={"x-small"} >{props.card.category}</Badge>
      <ChakraText fontSize={"smaller"} >{props.card.title}</ChakraText>
    </HStack>
  </Box>
}

const SlateEditor: React.FC<Types.EditorProps> = (props) => {
  const router = useRouter()
  const [editor] = React.useState(withLinks(withImages(withHistory(withReact(createEditor())))))
  const isMobileView = isMobile();
  const [editorCodeLang, setLanguage] = React.useState<
    Utils.CodeLanguages[] | null
  >(props?.card?.codeLanguages || [Utils.CodeLanguages.PLAIN_TEXT]);

  const [editorValue, setEditorValue] = React.useState(
    props.card ? JSON.parse(props.card?.text) : CustomComponents.initialValue
  );
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const [editorMode, setEditorMode] = React.useState<Utils.EditorMode>(
    router.query.mode === Utils.EditorMode.TRAIN || props.mode === Utils.EditorMode.TRAIN ? Utils.EditorMode.TRAIN : Utils.EditorMode.ADD
  );
  const isReadOnly = editorMode === Utils.EditorMode.TRAIN || isMobileView
  const textColor = useColorModeValue("teal.700", "white")

  // Focus the editor on inita lboot
  React.useEffect(() => {
    if (editorMode === Utils.EditorMode.ADD) return
    (document.querySelector(`#${SLATE_EDITOR_ID} input`) as HTMLInputElement)?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // for every lang we have in the editor - paint it.
  const decorate = React.useCallback(
    ([node, path]) => {
      if (!editorCodeLang) return;
      let finalDecorator: any = [];
      editorCodeLang?.forEach((lang) => {
        const dec = Utils.decorator([node, path], lang, editor);
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
        return <CustomComponents.CodeElement {...props} mode={editorMode} editorCodeLang={editorCodeLang} setLanguage={setLanguage} />;
      case "heading":
        return <h1 {...props.attributes} >{props.children}</h1>;
      case 'image':
        return <CustomComponents.Image {...props} />
      case 'link':
        return <CustomComponents.Link {...props} />
      default:
        return <CustomComponents.DefaultElement {...props} />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode]);

  return (
    <div ref={editorRef} data-editor>
      <Heading color={textColor}>{editorMode} Card</Heading>
      {editorMode === Utils.EditorMode.TRAIN && <CurrentCardInformation card={props.card} />}


      <Slate editor={editor} value={editorValue} onChange={(value) => setEditorValue(value)}>

        {!isReadOnly && <>
          <HoveringToolbar />
          <EditorOptions editor={editor} />
        </>
        }

        <Editable
          autoFocus readOnly={isReadOnly} style={{ color: 'black' }}
          placeholder='Enter some text (type "/" for more options)' decorate={decorate} id={SLATE_EDITOR_ID}
          className={classes.editor} renderElement={renderElement}
          onPaste={(event) => Events.handelPasteToEditor(event, editor)}
          onKeyDown={(event) => editorMode === Utils.EditorMode.ADD && Events.handelKeyDown(event, editor)}
          renderLeaf={(props) => (<CustomComponents.Leaf {...props} editorMode={editorMode} editor={editor} />)}
        />
      </Slate>

      < EditorActions editorMode={editorMode} editor={editor} codeLanguages={editorCodeLang}
        setEditorMode={setEditorMode} cardText={Utils.getEditorText(editor.children)} card={props.card} userCards={props.userDataFromDb.cards}
      />
    </div>
  );
};

export default SlateEditor;
Prism.languages.typeScript = Prism.languages.extend('typescript ', {});
