import { Editor, Text } from 'slate';
import Prism from 'prismjs';

const getLength = (token: any) => {
  if (typeof token === 'string') {
    return token.length;
  } else if (typeof token.content === 'string') {
    return token.content.length;
  } else {
    return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
  }
};

export const decorator = (
  [node, path]: any,
  editorCodeLang: any,
  editor: Editor
) => {
  const ranges: any = [];
  if ((!Text.isText(node) as any) || !editorCodeLang || node.rememberText) {
    return ranges;
  }
  const [parent] = Editor.parent(editor, path) as any;
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
