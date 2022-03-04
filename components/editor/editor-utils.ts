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
  TRAIN = "train",
  ADD = "add",
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

export enum CustomFormats {
  MARKER = 'marker',
  BOLD = 'bold',
  REMEMBER_TEXT = 'rememberText',
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
        text: window.getSelection()?.toString()?.trim(),
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

export const findClosestBlockAndNode = function (editor: Editor) {
  const [nodeData] = findCurrentNodeAtSelection(editor);
  const nodePath = nodeData[1];
  const [parentData, parentPath] = SlateEditor.parent(editor, nodePath) as any;
  return { node: { nodeData, nodePath }, parent: { parentData, parentPath } };
};

export const selectCurrentNode = function (editor: Editor) {
  const [match] = findCurrentNodeAtSelection(editor);

  if (!match) return;
  Transforms.select(editor, match[1]);
};
