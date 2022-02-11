export type CustomElement = { type: any; children: any };
export type CustomText = { text: any };
export type MarkerState = {
  directions: DOMRect;
  offset: number;
  functionality?: 'add' | 'remove';
  node?: any;
} | null;

export type CurrentWordRange = (Range & { word: string | undefined }) | null;
