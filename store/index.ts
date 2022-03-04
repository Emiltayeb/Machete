import { atom } from 'recoil';

export const isLoadingState = atom({
  key: 'isLoading', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const cardsCategories = atom({
  key: 'cardsCategories', // unique ID (with respect to other atoms/selectors)
  default: [] as string[], // default value (aka initial value)
});
