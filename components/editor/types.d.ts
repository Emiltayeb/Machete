import { CodeLanguages } from './utils';
export type CustomElement = { type: any; children: any };
export type CustomText = { text: any };

export type CardType = {
  text: string;
  title: string;
  id?: string;
  exec?: string;
  category: string;
  codeLanguages: CodeLanguages[] | null;
};
export interface EditorProps {
  mode: 'training' | 'editing';
  onSaveCard: (card: CardType) => void;
  card?: CardType | null;
}
