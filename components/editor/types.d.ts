import { CodeLanguages } from './utils';
export type CustomElement = { type: any; children: any };
export type CustomText = { text: any };

export type SaveCardArgs = { jsonText: string, codeLanguages: string[] | null, id?: string }
export type CardType = { text: string; id?: string, codeLanguages: CodeLanguages[] | null }
export interface EditorProps {
  mode: 'training' | 'editing';
  onSaveCard: (args: SaveCardArgs) => void;
  card?: CardType | null;
}
