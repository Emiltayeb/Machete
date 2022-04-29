import {
  BaseEditor,
  Editor as SlateEditor,
  Transforms,
  Node,
  Text,

} from 'slate';
import { ReactEditor } from 'slate-react';
import Prism from 'prismjs';

type Editor = BaseEditor & ReactEditor;

export enum EditorMode {
  TRAIN = "Train",
  ADD = "Edit",
  MULTIPLE_TRAIN = "multiple_train",
  SINGLE_TRAIN = "single_train",
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
  LINK = "link"
}
export const getEditorText = (nodes: any): string => {
  return nodes.map((n: any) => Node.string(n)).join('\n');
};

export const toggleFormat = (
  editor: Editor,
  format: CustomFormats,
  isActive?: boolean
) => {
  const { node } = findClosestBlockAndNode(editor)
  const { text, ...restFormats } = node.nodeData[0];

  console.log({ format, isActive });

  const nodes = [
    {
      ...restFormats,
      [format]: !isActive,
      text: window.getSelection()?.toString()?.trim(),
    }
  ]

  if (!isActive) {
    nodes.push({
      text: " "
    })
  }

  Transforms.insertNodes(
    editor, nodes,
    { match: Text.isText },
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
  const nodePath = nodeData?.[1];
  const [parentData, parentPath] = SlateEditor.parent(editor, nodePath || SlateEditor.end(editor, [])) as any;
  return { node: { nodeData, nodePath }, parent: { parentData, parentPath } };
};

export const selectCurrentNode = function (editor: Editor) {
  const [match] = findCurrentNodeAtSelection(editor);

  if (!match) return;
  Transforms.select(editor, match[1]);
};



const getLength = (token: any) => {
  if (typeof token === 'string') {
    return token.length;
  } else if (typeof token.content === 'string') {
    return token.content.length;
  } else {
    return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
  }
};


// get the code block and set custom css for 
export const decorator = (
  [node, path]: any,
  editorCodeLang: any,
  editor: Editor
) => {
  const ranges: any = [];


  if ((!Text.isText(node) as any) || !editorCodeLang || node.rememberText) {
    return ranges;
  }

  const [parent] = SlateEditor.parent(editor, path) as any;

  if (parent.type !== 'code') {
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
};

export const focusCurrentNode = function (editor: Editor) {
  const [currentNode] = findCurrentNodeAtSelection(editor);
  ReactEditor.focus(editor);
  if (!currentNode) return
  Transforms.collapse(editor, currentNode[1])
}

export const moveCursorToEndOfCurrentBlock = function (editor: Editor, path?: any[]) {
  ReactEditor.focus(editor);
  console.log(path);
  Transforms.select(editor, SlateEditor.end(editor, path || []));
}
export const getCurrentSelectedText = function () {
  return window.getSelection()?.toString()
}
