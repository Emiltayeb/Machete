import React, { useCallback } from 'react';
import classes from './editor.module.css';
import {BaseEditor, createEditor,} from 'slate';
import { Editable,  ReactEditor,  Slate,  withReact } from 'slate-react';
import { DOMRange } from 'slate-react/dist/utils/dom';
import Marker from '../floating-marker';
import * as Types from './types';
import * as Utils from './utils';
import * as CustomComponents from './custom-components';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { withHistory } from 'slate-history'

interface EditorProps {
  mode: 'training' | 'editing';
}
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: Types.CustomElement;
    Text: Types.CustomText;
  }
}
const SlateEditor: React.FC<EditorProps> = ({ mode }) => {
  const [editor] = React.useState(() => withHistory(withReact(createEditor())));
  const [markerState, setMarkerState] = React.useState<Types.MarkerState>(null);
  const [currentWordRange, setCurrentWordRange] =React.useState<Types.CurrentWordRange>(null);
  const rangeRef = React.useRef<null | DOMRange>(null);
  const [value, setValue] = React.useState(Utils.initialEditorValue);


  React.useEffect(() => {
    rangeRef.current = document.createRange();
      // removing the marker when we click outside of the slat editor
    document.body.addEventListener('click',(e)=>Utils.handelMarkerBlur(e,setMarkerState))
  }, []);

    const renderElement = React.useCallback((props) => {
    switch (props.element.type) {
      case Utils.ComponentMode.USER_WANT_TO_REMEMBER:
        return (
          <span
            {...props.attributes}
            onClick={(e)=>Utils.handelRemoveSelection(e,setMarkerState,rangeRef)}
            data-selected='true'
            className={classes.marked_text}>
            {props.children}
          </span>
        );

      case  Utils.ComponentMode.TRAINING:
        return <input type='text' name='' id='' {...props.attributes} />;
      default:
        return <CustomComponents.DefaultElement {...props} />;
    }
  }, []);
    const renderLeaf = React.useCallback((props) => {
    if (props.leaf.text.length === 0) return <></>;
    return <CustomComponents.Leaf {...props} />;
  }, []);

  return <>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue as any)}>
        <Editable
          id='SLATE_EDITOR'
          className={classes.editor}
          onSelect={(e)=>Utils.onSelectionChanged(e,setMarkerState,editor,setCurrentWordRange)}
          renderElement={renderElement}
          renderLeaf={renderLeaf}> 
          </Editable >

      </Slate>
         
      {markerState && (
        <Marker onMarkerClick={(e:any)=>Utils.onMarkerClick(e,editor,currentWordRange,setMarkerState,markerState)} markerState={markerState} />
      )}
    </>;
};

export default SlateEditor;
