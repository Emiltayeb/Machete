import { Button } from '@chakra-ui/react';
import { cx } from '@emotion/css';
import React, { PropsWithChildren, Ref } from 'react';
import { useRef } from 'react';
import { Editor, Text, Range } from 'slate';
import { useSlate, ReactEditor } from 'slate-react';
import { CustomFormats, toggleFormat } from './editor-utils';
import classes from './editor.module.scss';
import EditorPortal from './EditorPotral';

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

// eslint-disable-next-line react/display-name
export const Menu = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref) => (
    <div
      {...props}
      ref={ref as any}
      className={cx(className, classes.tool_bar_menu)}
    />
  )
);
const matchedNodes = {} as any;

export const HoveringToolbar = () => {
  const currNodeRef = useRef<any>();

  const editor = useSlate();

  React.useEffect(() => {

    const [match] = Editor.nodes(editor, {
      match: (node) => {
        if (!Text.isText(node)) return false;
        const index = ReactEditor.findPath(editor, node).join('');
        matchedNodes[index] = node
        return true;
      },
    }) as any;

    currNodeRef.current = match?.[0];

  })


  // Check if we need to apply format
  const compareFormat = function (format: CustomFormats) {
    if (!editor.selection) return;

    const { anchor, focus } = editor.selection;
    if (!anchor.path || !focus.path) return;

    const { path: anchorPath } = anchor;
    const { path: focusPath } = focus;

    const delta = Math.abs(
      anchorPath[0] + anchorPath[1] - (focusPath[1] + focusPath[0])
    );

    if (delta === 0) {
      return matchedNodes[anchorPath.join('')]?.[format];
    } else if (delta === 1) {
      // simply check if both of the nodes has the requested format
      const firstNode = matchedNodes[anchorPath.join('')];
      const secondNode = matchedNodes[focusPath.join('')];
      return firstNode?.[format] && secondNode?.[format];
    }
    // making sure to loop loop only for the necessary nodes.

    const anchorNumber = +anchorPath.join('');
    const focusNumber = +focusPath.join('');

    const keys = Object.keys(matchedNodes)
      .sort()
      .map((val) => +val)
      .filter((val) => val - anchorNumber >= 0 || val - focusNumber >= 0);

    let shouldFormat = true;
    for (const key of keys) {
      const node = matchedNodes[key.toString()];
      if (!node?.[format]) {
        shouldFormat = false;
      }
    }

    return shouldFormat;
  };

  const displayToolBar = editor?.selection && Editor.string(editor, editor?.selection as any).length && ReactEditor?.isFocused(editor)
  return (
    <EditorPortal>

      {
        displayToolBar ? <Menu className={classes.Menu}>
          <FormatButton
            isFormatActive={compareFormat(CustomFormats.BOLD)}
            format='bold'
            icon='B'
            currNode={currNodeRef}
          />

          <FormatButton
            currNode={currNodeRef}
            isFormatActive={compareFormat(CustomFormats.MARKER)}
            format={CustomFormats.MARKER}
            disableMarker={CustomFormats.REMEMBER_TEXT}
            icon='H'
          />


          <FormatButton
            isFormatActive={compareFormat(CustomFormats.REMEMBER_TEXT)}
            format={CustomFormats.REMEMBER_TEXT}
            disableMarker={CustomFormats.MARKER}
            currNode={currNodeRef}
            icon='R'
          />

        </Menu> : <></>
      }
    </EditorPortal>
  );
};

export const FormatButton = (props: any) => {
  const { format, icon, currNode, disableMarker } = props;
  const editor = useSlate();
  return (
    <Button
      colorScheme={"black"}
      className={cx(classes.format_button, props.isFormatActive ? classes.active : '')}
      size="sm"
      disabled={currNode.current?.[disableMarker]}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleFormat(editor, format, props.isFormatActive);
      }}>

      <div>{icon}</div>
    </Button>
  );
};


