import { Box, Button, VStack } from "@chakra-ui/react";
import { useSlate } from "slate-react";
import EditorPortal from "./EditorPotral";
import { createCodeBlock, createHEading } from "./editor-events"
import { CustomFormats, findCurrentNodeAtSelection, getCurrentSelectedText } from "./editor-utils";
import ReactFocusLock, { MoveFocusInside } from "react-focus-lock";

const EditorOptions = function (props: any) {
	const editor = useSlate();

	const [currentNode] = findCurrentNodeAtSelection(editor);

	const Option = function (text: string, operation: any) {
		return <Button size={"xs"} onClick={operation}
			colorScheme="black" _hover={{ background: "white", color: "black" }} border={"1px solid white"} cursor="pointer">{text}</Button>
	}
	return <EditorPortal toShow={!!currentNode?.[0].text?.match(/\/$/) && !getCurrentSelectedText()?.length && currentNode.type !== CustomFormats.REMEMBER_TEXT}>
		<VStack rounded="base" minWidth={"200px"} alignItems={"flex-start"} bgColor={"AppWorkspace"} color="white" p={2} >
			{Option("Create code", () => { createCodeBlock(props.editor) })}
			{Option("Heading", () => { createHEading(props.editor) })}
		</VStack>



	</EditorPortal>
}

export default EditorOptions;