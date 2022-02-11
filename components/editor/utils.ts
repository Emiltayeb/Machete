import { Transforms } from "slate";
enum SlateSelector {DATA_SELECTED = "[data-selected]"}
enum MarkerFunctionality {ADD = "add" , Remove  = "remove"}
export enum ComponentMode {
  USER_WANT_TO_REMEMBER,
  TRAINING,
}
export const getOffset = function (selection: any) {
  let position = selection.anchorNode.compareDocumentPosition(
      selection.focusNode
    ),
    backward = false;
  if (
    (!position && selection.anchorOffset > selection.focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  )
    backward = true;

  const offset = !backward
    ? selection.focusOffset - selection.anchorOffset
    : selection.anchorOffset - selection.focusOffset;
  return offset;
};

export const initialEditorValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

//  checks if user new selection is intersectio with  another
  const isUserSelectionIncludeOtherSelection =  (range:Range)=> Array.from(range.cloneContents().childNodes).some((child) => {
        if (child instanceof HTMLElement) {
          return child.getAttribute('data-selected') === 'true';
        }
      })

  // removing the marker when we click outside of the slat editor
  export const handelMarkerBlur = function(e:any,setMarkerState:any){
      if (!e.target) return;
        const node = e.target as HTMLSpanElement;
        const el = node.closest('div');
        if (!el) return;
        if (
          el.dataset.slateEditor === 'true' ||
          el.dataset.editorMarker === 'true'
        )
          return;
        setMarkerState(null);
  }
  // when user marker word we insert it to the editor
  export const handleInsertWord = (currentWordRange:any,editor:any,setMarkerState:any) => {
    if (!currentWordRange) return;
    Transforms.insertNodes(
      editor,
      { type: ComponentMode.USER_WANT_TO_REMEMBER, children: [{ text: currentWordRange.word }] },
      {
        at: currentWordRange,
        voids: true,
      }
    );
    setMarkerState(null);
  };

    // selection change
 export  const onSelectionChanged = (e: React.SyntheticEvent<HTMLDivElement, Event>,setMarkerState:any,editor:any,setCurrentWordRange:any) => {
    e.preventDefault();
    // setting cursor position to open marker
    const sel = window.getSelection();
    const textSelected = sel?.toString();


    if (!sel || sel.rangeCount === 0 || !textSelected?.length|| (textSelected &&  textSelected?.length < 2)) {
      setMarkerState(null);
      return;
    }

    const offset = getOffset(sel);
   const range = sel.getRangeAt(0);
    const direction = range.getBoundingClientRect();

    // if the user selection includes selected word - we should merge it
    if (isUserSelectionIncludeOtherSelection(range) ) {
      console.log('your selection includes another!');
    }

    if (!editor.selection?.anchor || !editor.selection.focus) return;
    setCurrentWordRange({
      anchor: {
        path: editor.selection.anchor.path,
        offset: sel.anchorOffset,
      },
      focus: {
        path: editor.selection.focus.path,
        offset: sel.focusOffset,
      },
      word: textSelected,
    });
    setMarkerState({ directions: direction, offset, functionality: 'add' });
  };

    // remove selection
 export  const handelRemoveSelection = function (e: React.MouseEvent<HTMLSpanElement>,setMarkerState:any,rangeRef:any) {
    const node = e.target as HTMLElement;
    setMarkerState({
      directions: node.getBoundingClientRect(),
      offset: 0,
      functionality: 'remove',
      node,
    });

    rangeRef.current?.selectNode(node.lastChild);
  };
    //marker click
  export const onMarkerClick = function (e: React.MouseEvent<any>,editor:any,currentWordRange:any,setMarkerState:any,markerState:any) {
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.log("onmakreClick",markerState)
    if (markerState?.functionality === MarkerFunctionality.ADD) {
      handleInsertWord(currentWordRange,editor,setMarkerState);
    } else if (markerState?.functionality === MarkerFunctionality.Remove) {
      Transforms.removeNodes(editor);
      Transforms.insertText(editor, markerState.node.textContent);
      // Transforms.unwrapNodes(editor, { at: currentWordRange });
    }
    setMarkerState(null);
  };
