import { Button } from '@chakra-ui/react';
import { cx } from '@emotion/css';
import React, { PropsWithChildren, Ref } from 'react';
import { useRef } from 'react';
import { Editor, Text } from 'slate';
import { useSlate, ReactEditor, useSlateStatic } from 'slate-react';
import { CustomFormats, toggleFormat } from '../editor-utils';
import classes from './hovering-toolbar.module.scss';
import EditorPortal from '../EditorPotral';
import { insertLink } from '../editor-events';


interface BaseProps {
  className: string;
  [key: string]: unknown;
}

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


export const HoveringToolbar = () => {
  const matchedNodes = useRef<Record<string, any>>({});
  const currNodeRef = useRef<any>();
  const editor = useSlate();

  React.useEffect(() => {

    const [match] = Editor.nodes(editor, {
      match: (node) => {
        if (!Text.isText(node)) return false;
        try {
          const index = ReactEditor.findPath(editor, node).join('');
          matchedNodes.current[index] = node
          return true;
        } catch (error) {
          return false
        }
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
      return matchedNodes.current[anchorPath.join('')]?.[format];
    } else if (delta === 1) {
      // simply check if both of the nodes has the requested format
      const firstNode = matchedNodes.current[anchorPath.join('')];
      const secondNode = matchedNodes.current[focusPath.join('')];
      return firstNode?.[format] && secondNode?.[format];
    }
    // making sure to loop loop only for the necessary nodes.

    const anchorNumber = +anchorPath.join('');
    const focusNumber = +focusPath.join('');

    const keys = Object.keys(matchedNodes.current)
      .sort()
      .map((val) => +val)
      .filter((val) => val - anchorNumber >= 0 || val - focusNumber >= 0);

    let shouldFormat = true;
    for (const key of keys) {
      const node = matchedNodes.current[key.toString()];
      if (!node?.[format]) {
        shouldFormat = false;
      }
    }

    return shouldFormat;
  };

  const displayToolBar = editor?.selection && Editor.string(editor, editor?.selection as any).length && ReactEditor?.isFocused(editor)
  return (
    <EditorPortal toShow={!!displayToolBar}>
      <Menu className={classes.Root}>
        <FormatButton
          isFormatActive={compareFormat(CustomFormats.BOLD)}
          format='bold'
          icon='B'
          disableMarkers={CustomFormats.REMEMBER_TEXT}
          currNode={currNodeRef}
        />

        <FormatButton
          currNode={currNodeRef}
          isFormatActive={compareFormat(CustomFormats.MARKER)}
          format={CustomFormats.MARKER}
          disableMarkers={CustomFormats.REMEMBER_TEXT}
          icon='H'
        />


        <FormatButton
          isFormatActive={compareFormat(CustomFormats.REMEMBER_TEXT)}
          format={CustomFormats.REMEMBER_TEXT}
          disableMarkers={[CustomFormats.MARKER, CustomFormats.BOLD]}
          currNode={currNodeRef}
          icon='R'
        />

        <FormatButton
          onClick={() => {
            const url = prompt("enter link")
            insertLink(editor, url)
          }}
          format={CustomFormats.LINK}
          icon='Link'
        />

      </Menu>
    </EditorPortal>
  );
};

export const FormatButton = (props: any) => {
  const { format, icon, currNode, disableMarkers } = props;
  const editor = useSlate();
  // disable format when were in code block  but allow to remember me text
  const disabled = format !== CustomFormats.REMEMBER_TEXT || (currNode?.current.codeLang || Object.keys(currNode?.current || {}).some((key) => disableMarkers.includes(key)))
  return (
    <Button
      _hover={{ backgroundColor: '#f5f5f5', color: "black" }}
      colorScheme={"black"}
      className={cx(classes.format_button, props.isFormatActive ? classes.active : '')}
      size="sm"
      disabled={disabled}
      onMouseDown={(event: any) => {
        event.preventDefault();
        props?.onClick?.() || toggleFormat(editor, format, props.isFormatActive);
      }}>

      <div>{icon}</div>
    </Button>
  );
};


