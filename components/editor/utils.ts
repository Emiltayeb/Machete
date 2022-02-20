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

export const MARKER_ID = 'editor_marker_button';
export enum Marks {
  DATA_SELECTED = '[data-selected]',
  IDENTIFIER = 'identifier',
  MARKED_TEXT = 'marked_text',
}
export enum EditorMode {
  TRAIN,
  ADD,
}
export enum EditorTextType {
  TEXT,
  CODE,
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

enum MarkerFunctionality {
  ADD = 'add',
  Remove = 'remove',
}
export enum ComponentMode {
  USER_WANT_TO_REMEMBER,
  TRAINING,
}

export const getEditorText = (nodes: any) => {
  return nodes.map((n: any) => Node.string(n)).join('\n');
};

export const createNode = function (text: string, type?: string) {
  return [
    {
      type: type || 'p',
      children: [{ text }],
    },
  ];
};

export const placeHolerElement = createNode('A place holder', 'placeHolder');

const findCurrentChild = (editor: any, text: string, specialIdent?: any) => {
  if (!text) return;
  let found;

  if (Array.isArray(editor.children))
    editor.children.forEach((child: any) => {
      child.children.forEach((chi: any) => {
        if (chi[Marks.MARKED_TEXT]) {
          if (chi.text === text) {
            found = chi;
          }
          if (specialIdent && chi.identifier.toString() === specialIdent) {
            found = chi;
          }
        }
      });
    });
  return found;
};

export const getOffset = function (selection: any) {
  let position = selection.anchorNode.compareDocumentPosition(
      selection.focusNode
    ),
    backward = false;
  if (!position && selection.anchorOffset > selection.focusOffset)
    backward = true;

  const offset = !backward
    ? selection.focusOffset - selection.anchorOffset
    : selection.anchorOffset - selection.focusOffset;
  return offset;
};

// removing the marker when we click outside of the slat editor
export const handelMarkerBlur = function (e: any, setMarkerState: any) {
  if (!e.target) return;
  const node = e.target as HTMLSpanElement;
  const el = node.closest('div');
  if (!el) return;
  if (el.dataset.slateEditor === 'true' || el.dataset.editorMarker === 'true')
    return;
  setMarkerState(null);
};
// when user marker word we insert it to the editor
export const handleInsertWord = (
  currentWordRange: any,
  editor: Editor,
  setMarkerState: any
) => {
  if (!currentWordRange) return;
  Transforms.insertNodes(
    editor,
    {
      type: ComponentMode.USER_WANT_TO_REMEMBER,
      children: [{ text: currentWordRange.word }],
    },
    {
      at: currentWordRange,
      voids: true,
    }
  );
  setMarkerState(null);
};

// selection change
export const onSelectionChanged = (
  e: React.SyntheticEvent<HTMLDivElement, Event>,
  setMarkerState: any,
  editor: Editor,
  setCurrentWordRange: React.Dispatch<React.SetStateAction<CurrentWordRange>>,
  markerVisibleREf: any
) => {
  // setting cursor position to open marker
  const sel = window.getSelection();
  const textSelected = sel?.toString();
  if (
    !sel ||
    sel.rangeCount === 0 ||
    !textSelected ||
    !textSelected.replace(/ /g, '')?.length
  ) {
    setMarkerState(null);
    return;
  }

  const offset = getOffset(sel);
  const range = sel.getRangeAt(0);
  const direction = range.getBoundingClientRect();

  setMarkerState({
    directions: direction,
    offset,
    functionality: MarkerFunctionality.ADD,
  });
  markerVisibleREf.current = true;
  setCurrentWordRange({ range, word: textSelected });
};

// remove selection
export const handelRemoveSelection = function (
  e: React.MouseEvent<HTMLSpanElement>,
  setMarkerState: any,
  rangeRef: any
) {
  const node = e.target as HTMLElement;
  setMarkerState({
    directions: node.getBoundingClientRect(),
    offset: 0,
    functionality: MarkerFunctionality.Remove,
    node,
  });

  rangeRef.current?.selectNode(node.lastChild);
};

//marker click
export const onMarkerClick = function (
  e: React.MouseEvent<HTMLSpanElement>,
  editor: Editor,
  currentWordRange: CurrentWordRange,
  setMarkerState: any,
  markerState: any
) {
  e.nativeEvent.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();

  if (markerState?.functionality === MarkerFunctionality.ADD) {
    editor.addMark(Marks.MARKED_TEXT, true);
    editor.addMark(Marks.IDENTIFIER, e.pageX);

    let path = editor.selection as any;
    const selection = window.getSelection?.().toString().replace(/\n|\r/g, ' ');
    try {
      Transforms.insertText(editor, selection);
    } catch (error) {
      Transforms.insertText(editor, selection, {
        at: editor?.selection.anchor.path,
      });
      path = editor?.selection.anchor.path;
    }

    // // Transfconst node = Node.get(editor, path)orms.select(editor, path);
  } else if (markerState?.functionality === MarkerFunctionality.Remove) {
    // find the current element clicked form the editor
    const found = findCurrentChild(
      editor,
      markerState.node.textContent,
      markerState.node.parentElement.dataset.identifier
    );

    if (!found) return;

    try {
      const path = ReactEditor.findPath(editor, found);
      Transforms.select(editor, path);
      editor.removeMark(Marks.MARKED_TEXT);
    } catch (error) {
      console.log('MarkerFunctionality.Remove error:', error);
    }
  }
  setMarkerState(null);
};
