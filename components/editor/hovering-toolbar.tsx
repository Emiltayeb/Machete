import { cx } from '@emotion/css';
import React, { PropsWithChildren, Ref } from 'react';
import { useRef } from 'react';
import { Editor, Text, Range } from 'slate';
import { useSlate, ReactEditor } from 'slate-react';
import { Portal } from '../layout/Portal';
import { toggleFormat } from './editor-utils';
import classes from './editor.module.scss';

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

export const HoveringToolbar = (props: {
  shouldHide: boolean;
  setShouldHide: any;
}) => {
  const ref = useRef<HTMLDivElement | null>();
  const currNodeRef = useRef<any>();
  const editor = useSlate();

  const selectedText = window.getSelection()?.toString();

  React.useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }
    const [match] = Editor.nodes(editor, {
      match: (node) => {
        if (!Text.isText(node)) return false;
        const index = ReactEditor.findPath(editor, node).join('');
        matchedNodes[index] = node;
        return true;
      },
    }) as any;

    currNodeRef.current = match?.[0];
    if (
      !selection ||
      !ReactEditor?.isFocused(editor) ||
      !selectedText?.length ||
      Range?.isCollapsed?.(selection) ||
      window.getSelection()?.toString().length === 0 ||
      props.shouldHide ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      props.setShouldHide(false);
      return;
    }
    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  // Check if we need to apply format
  const compareFormat = function (format: string) {
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
  return (
    <Portal>
      <Menu ref={ref} className={classes.Menu}>
        {/* TODO:: Creat enums for markers.*/}
        {/* TODO:: create icons from galit*/}
        <FormatButton
          isFormatActive={compareFormat('bold')}
          format='bold'
          icon='B'
        />
        {!currNodeRef.current?.['rememberText'] === true && (
          <FormatButton
            currNode={currNodeRef.current}
            isFormatActive={compareFormat('marker')}
            format='marker'
            icon='H'
          />
        )}
        {!currNodeRef.current?.['marker'] && (
          <FormatButton
            isFormatActive={compareFormat('rememberText')}
            format='rememberText'
            icon='R'
          />
        )}
      </Menu>
    </Portal>
  );
};

export const FormatButton = (props: any) => {
  const { format, icon, isFormatActive } = props;
  const editor = useSlate();
  return (
    <Button
      active={isFormatActive}
      reversed
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleFormat(editor, format, isFormatActive);
      }}>
      <div>{icon}</div>
    </Button>
  );
};

// eslint-disable-next-line react/display-name
export const Button = React.forwardRef(
  (
    {
      active,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref as any}
      className={cx(classes.format_button, active ? classes.active : '')}
    />
  )
);
