import { CodeLanguage, EditorMode } from './editor-utils';
export type CustomElement = { type: any; children: any };
export type CustomText = { text: any };

export type CardType = {
  text: string;
  title: string;
  id?: string;
  exec?: string;
  category: string;
  allowTrain: boolean;

};
export interface EditorProps {
  mode: EditorMode;
  card?: CardType | null;
  userDataFromDb?: any;
  db?: any
}
