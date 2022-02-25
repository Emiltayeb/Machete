export type CustomElement = { type: any; children: any };
export type CustomText = { text: any };
export interface EditorProps {
  mode: 'training' | 'editing';
  onSaveCard: (data: any, id?: string) => void;
  card: { text: string; id?: string };
}
