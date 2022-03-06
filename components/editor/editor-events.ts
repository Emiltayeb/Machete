import { Editor, Transforms } from 'slate';

import * as Utils from './editor-utils';
import { CardType } from './types';
import { doc, updateDoc } from 'firebase/firestore';
import { v4 } from 'uuid';

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
      if (nodeData.type === 'code' || parentData.type === "code") {
        event.preventDefault();

        if (shiftKey) {
          editor.insertText('\n');
          break;
        }
        Transforms.insertNodes(editor, {
          type: 'block',
          children: [{ text: '' }],
        });
      }

      break;

    case 'Backspace':
      {
        const { parent } = Utils.findClosestBlockAndNode(editor);
        const { parentData, parentPath } = parent;

        if (parentData.type === 'code') {
          const isEmpty = parentData?.children?.[0].text.length - 1 <= 0;

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
    default:
      break;
  }
};

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
  db: any
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

    console.log(updatedData);

    await updateDoc(updateDocREf, {
      cards: updatedData,
    });
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
    const updatedCards = userData?.cards.filter((card: any) => card.id !== cardId)
    await updateDoc(ref, {
      cards: updatedCards,
    });
  } catch (error) {
    console.log(error)
  }
};
