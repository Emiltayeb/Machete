import {
  BaseEditor,
  Path,
  Editor as SlateEditor,
  Transforms,
  Node,
  Text,
} from 'slate';
import { ReactEditor } from 'slate-react';
import { CurrentWordRange } from './types';

type Editor = BaseEditor & ReactEditor;

export enum EditorMode {
  TRAIN,
  ADD,
}

export enum CodeLanguages {
  HTML = 'html',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  CSS = 'css',
  PLAIN_TEXT = 'plaintext',
  C = 'c',
  JAVA = 'java',
}

export enum ComponentMode {
  USER_WANT_TO_REMEMBER,
  TRAINING,
}

export const getEditorText = (nodes: any) => {
  return nodes.map((n: any) => Node.string(n)).join('\n');
};

export const toggleFormat = (
  editor: Editor,
  format: any,
  isActive: boolean
) => {
  const [match] = SlateEditor.nodes(editor, {
    match: (node) => {
      if (!Text.isText(node)) return;
      return true;
    },
  }) as any;

  console.log(editor.selection);
  const { text, ...restFormats } = match[0];

  Transforms.insertNodes(
    editor,
    [
      {
        ...restFormats,
        [format]: !isActive,
        text: window.getSelection()?.toString(),
      },
    ],
    { match: Text.isText, hanging: true, voids: true }
  );

  // insert node at the end of current selection

  // console.log(editor.selection);
  // Transforms.insertNodes(
  //   editor,
  //   [
  //     {
  //       type: 'span',
  //       text: '',
  //       bold: false,
  //     },
  //   ],
  //   {
  //     at: {
  //       focus: editor.selection?.focus,
  //       anchor: editor.selection?.anchor,
  //       offset: editor.selection?.focus.offset,
  //       path: editor.selection?.focus,
  //     },
  //   }
  // );
};
