import { Box, Button, VStack } from "@chakra-ui/react";
import { useSlate } from "slate-react";
import EditorPortal from "./EditorPotral";
import { createCodeBlock, createHEading } from "./editor-events"
import { findCurrentNodeAtSelection, getCurrentSelectedText } from "./editor-utils";
import ReactFocusLock, { MoveFocusInside } from "react-focus-lock";

const EditorOptions = function (props: any) {
	const editor = useSlate();

	const [currentNode] = findCurrentNodeAtSelection(editor);

	const Option = function (text: string, operation: any) {
		return <Button size={"xs"} onClick={operation}
			colorScheme="black" _hover={{ background: "white", color: "black" }} border={"1px solid white"} cursor="pointer">{text}</Button>
	}
	console.log()
	return <EditorPortal toShow={!!currentNode?.[0].text?.match(/\/$/) && !getCurrentSelectedText()?.length}>
		<VStack minWidth={"200px"} alignItems={"flex-start"} bgColor={"AppWorkspace"} color="white" p={2} >
			{Option("Create code", () => { createCodeBlock(props.editor) })}
			{Option("Add Heading", () => { createHEading(props.editor) })}
		</VStack>



	</EditorPortal>
}

export default EditorOptions;