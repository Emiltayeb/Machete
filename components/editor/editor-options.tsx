import { Box, Button, VStack } from "@chakra-ui/react";
import { ReactEditor, useSlate } from "slate-react";
import EditorPortal from "./EditorPotral";
import { createCodeBlock, createHEading } from "./editor-events"
import { CustomFormats, findCurrentNodeAtSelection, getCurrentSelectedText } from "./editor-utils";
import ReactFocusLock, { MoveFocusInside } from "react-focus-lock";
import * as React from 'react';
import { Editor } from "slate";

const EditorOptions = function (props: any) {
	const editor = useSlate();

	const [currentNode] = findCurrentNodeAtSelection(editor);
	const [toShow, setToShow] = React.useState(false)
	const ref = React.useRef<any>()

	const handelCloseOptionsWhenOutOfFocus = (e: KeyboardEvent) => {
		if (e.key !== "Escape") return
		setToShow(false)
		ReactEditor.focus(editor)
	}
	React.useLayoutEffect(() => {
		if (!toShow) return
		setTimeout(() => {
			ref.current?.focus?.()
		}, 0);
		window.addEventListener("keydown", handelCloseOptionsWhenOutOfFocus)
		return () => { window.removeEventListener("keydown", handelCloseOptionsWhenOutOfFocus) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toShow])

	React.useEffect((() => {
		setToShow(!!currentNode?.[0].text?.match(/\/$/) && !getCurrentSelectedText()?.length && currentNode.type !== CustomFormats.REMEMBER_TEXT)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [currentNode?.[0].text, currentNode?.type])

	const Option = function (text: string, operation: any, btnRef?: any) {
		return <Button ref={btnRef} size={"xs"} onClick={operation}
			colorScheme="black" _focus={{ background: "blue.200" }} _hover={{ background: "white", color: "black" }} border={"1px solid white"} cursor="pointer">{text}</Button>
	}
	return <EditorPortal toShow={toShow}>
		<VStack rounded="base" minWidth={"200px"} alignItems={"flex-start"} bgColor={"AppWorkspace"} color="white" p={2} >
			{Option("Create code", () => { createCodeBlock(props.editor) }, ref)}
			{Option("Heading", () => { createHEading(props.editor) })}
		</VStack>



	</EditorPortal>
}

export default EditorOptions;