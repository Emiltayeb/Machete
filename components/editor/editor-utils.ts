import {
  BaseEditor,
  Path,
  Editor as SlateEditor,
  Transforms,
  Node,
  Text,
} from 'slate';
import { ReactEditor } from 'slate-react';

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
      if (!Text.isText(node)) return false;
      return true;
    },
  }) as any;
  const { text, ...restFormats } = match[0];
  Transforms.insertNodes(
    editor,
    [
      {
        ...restFormats,
        [format]: !isActive,
        text: window.getSelection()?.toString()?.trim()?.replace('\n', ''),
      },
    ],
    { match: Text.isText }
  );
};

export const findCurrentNodeAtSelection = function (editor: Editor) {
  return SlateEditor.nodes(editor, {
    match: (node: any) => {
      if (!Text.isText(node)) return false;
      return true;
    },
  }) as any;
};
