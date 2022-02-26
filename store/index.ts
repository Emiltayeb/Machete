import { atom } from 'recoil';

export const isLoadingState = atom({
  key: 'isLoading', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
