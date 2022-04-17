import { ReactEditor } from 'slate-react';
import { Editor, Transforms, Element, Range, Path } from 'slate';
import * as Utils from './editor-utils';
import { CardType } from './types';
import { doc, updateDoc } from 'firebase/firestore';
import { v4 } from 'uuid';
import { toggleFormat } from './editor-utils';

let isAllChildrenSelected = false;

export const handelKeyDown = function (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor
) {
  const { key, shiftKey, ctrlKey, metaKey } = event;

  if (isAllChildrenSelected) {
    Transforms.delete(editor);
    Transforms.setNodes(editor, {
      text: ' ',
      type: 'span',
    });
    isAllChildrenSelected = false;
  }
  switch (key) {
    case 'Enter':
      // find current  node
      const { node, parent } = Utils.findClosestBlockAndNode(editor);
      const { nodeData } = node;
      const { parentData } = parent
      event.preventDefault();
      // reset events
      if (nodeData?.type === 'code' || parentData?.type === "code") {

        // in case of code element - simply go down on line when pressing with shift
        if (shiftKey) {
          editor.insertText('\n');
          break;
        }
        Utils.moveCursorToEndOfCurrentBlock(editor)
        Transforms.insertNodes(editor, {
          type: 'block',
          children: [{ text: '' }],
        });
      }
      else {
        // reset styles after enter
        Transforms.insertNodes(editor, {
          type: 'block',
          children: [{ text: '' }],
        });

      }
      break;

    case 'Backspace':
      {
        const { parent } = Utils.findClosestBlockAndNode(editor);
        const { parentData } = parent;

        if (parentData.type === 'code') {
          const isEmpty = parentData?.children?.[0].text.length <= 0;

          if (isEmpty) {
            Transforms.setNodes(editor, { type: 'span' });
          }
        }
      }
      break;
    case 'a':
      if (metaKey || ctrlKey) {
        isAllChildrenSelected = true;
      }

    case "b":
      if (ctrlKey || metaKey) {

        toggleFormat(editor, Utils.CustomFormats.BOLD)
      }
      break;
    default:
      break;
  }
};

export const handelPasteToEditor = function (e: React.ClipboardEvent<HTMLDivElement>, editor: Editor) {
  e.preventDefault();
  const text = e.clipboardData.getData('Text');
  editor.insertText(text);
}
export const showOptions = function (editor: Editor, setShowOptions: (toShow: boolean) => void) {
  const [currentNode] = Utils.findCurrentNodeAtSelection(editor);
  const toShowOptions = currentNode?.[0].text?.match(/\//);
  setShowOptions(toShowOptions?.length > 0)
}

export const createCodeBlock = function (editor: Editor) {
  editor.deleteBackward("character")
  editor.insertBreak();
  Transforms.insertFragment(editor, [
    { type: 'code', children: [{ text: '' }] },
  ]);
  Utils.focusCurrentNode(editor)
}

export const removeLink = (editor: Editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "link"
  });
};

export const insertLink = function (editor: Editor, url: string | null) {

  if (!url) return;

  const { selection } = editor;
  const link = {
    type: "link",
    href: url,
    children: [{ text: "" }],
  }


  ReactEditor.focus(editor);

  if (!!selection) {
    const [parentNode, parentPath] = Editor.parent(
      editor,
      selection.focus?.path
    ) as any

    // Remove the Link node if we're inserting a new link node inside of another
    // link.
    if (parentNode.type === "link") {
      console.log("removing link")
      Transforms.delete(editor, { at: selection })
    }

    Transforms.delete(editor, { at: selection })
    // Wrap the currently selected range of text into a Link
    Transforms.insertNodes(editor, link);
    setTimeout(() => {
      Transforms.collapse(editor, { edge: "end" });
    }, 0);
  }

}

export const createHeading = function (editor: Editor) {
  editor.deleteBackward("character")
  editor.insertBreak();
  Transforms.insertFragment(editor, [
    { type: 'heading', children: [{ text: 'Heading' }] },
  ]);
  Utils.focusCurrentNode(editor)
}

export const handelCreatCodeBlock = function (
  editor: Editor,
  setLanguage: any
) {

  const [currentNode] = Utils.findCurrentNodeAtSelection(editor);
  if (!currentNode) return;

  const codeRegex = currentNode[0].text?.match(/`{3}([a-z]*)/);
  const lang =
    codeRegex?.[1].toLocaleUpperCase() as keyof typeof Utils.CodeLanguages;

  if (lang) {
    editor.deleteBackward('word');
    Transforms.insertFragment(editor, [
      { type: 'code', children: [{ text: '' }] },
    ]);

    setLanguage((prev: Array<keyof typeof Utils.CodeLanguages>) => {
      if (
        prev.includes(
          lang.toLocaleLowerCase() as keyof typeof Utils.CodeLanguages
        )
      ) {
        return prev;
      }
      return [
        ...prev,
        Utils.CodeLanguages?.[lang] || Utils.CodeLanguages.PLAIN_TEXT,
      ];
    });
  }
};

export const onCardSave = async function (
  newCard: CardType,
  userData: any,
  db: any,
  onCreate?: (id: any) => void
) {
  let cardId;
  try {
    const isNewCard = !newCard.id;
    const updateDocREf = doc(db, 'users', userData.NO_ID_FIELD);

    if (isNewCard) {
      cardId = v4();
    }
    const updatedData: CardType[] = isNewCard
      ? [
        ...userData?.cards,
        {
          text: newCard.text,
          id: cardId,
          codeLanguages: newCard.codeLanguages,
          category: newCard.category,
          title: newCard.title,
          exec: newCard.exec,
          allowTrain: newCard.allowTrain
        },
      ]
      : userData.cards.map((currCard: CardType) => {
        if (newCard.id === currCard.id) {
          return newCard;
        }
        return currCard;
      });

    await updateDoc(updateDocREf, {
      cards: updatedData,
    });
    onCreate?.(cardId)
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const onDeleteCard = async function (
  userData: any,
  db: any,
  cardId?: string,
) {
  try {
    const ref = doc(db, 'users', userData.NO_ID_FIELD);
    const updatedCards = userData?.cards.filter((card: CardType) => card.id !== cardId)
    await updateDoc(ref, {
      cards: updatedCards,
    });
  } catch (error) {
    console.log(error)
  }
};


export const onCardCategoryChange = async function (userData: any, db: any, oldCat: string, newCategory: string) {
  try {
    const ref = doc(db, 'users', userData.NO_ID_FIELD);
    const updatedCards = [...userData?.cards].map((card: CardType) => {
      if (card.category === oldCat) {
        const temCard = Object.assign({}, card)
        temCard.category = newCategory
        return temCard
      }
      return card
    })
    await updateDoc(ref, {
      cards: updatedCards,
    });
  } catch (error) {
    console.log(error)
  }
}