import { CardType } from './../components/editor/types.d';
import { atom } from 'recoil';

export const userCategoriesAtom = atom({
  key: 'userCategories', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});


export const trainCardsAtom = atom({
  key: 'trainCards', // unique ID (with respect to other atoms/selectors)
  default: [] as CardType[] | CardType, // default value (aka initial value)
});


