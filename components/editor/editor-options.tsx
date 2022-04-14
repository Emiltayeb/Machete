import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Progress, useDisclosure, VStack } from "@chakra-ui/react";
import { ReactEditor, useSlate, useSlateStatic } from "slate-react";
import EditorPortal from "./EditorPotral";
import { createCodeBlock, createHeading } from "./editor-events"
import { CustomFormats, findCurrentNodeAtSelection, getCurrentSelectedText } from "./editor-utils";
import * as React from 'react';
import { InsertImageButton, insertImage } from "./with-image";
import { storage } from "../../services/firebase-config";
import { ref } from "firebase/storage";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";



const uploadImage = function (e: any, setProg: any, setImageToEditor: any) {
	e.preventDefault()
	if (!e.target) return
	const file = e?.target[0]?.files[0]
	if (!file) return
	const storageRef = ref(storage, `/files/${file.name}`)
	const uploadTask = uploadBytesResumable(storageRef, file)

	uploadTask.on("state_changed", (snapshot) => {
		const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
		setProg(prog)
	}, (err) => { console.log(err); setProg(0) }, () => {
		getDownloadURL(uploadTask.snapshot.ref).then(url => setImageToEditor(url))
	})
}


// TODO: after you enter / remove it.

const EditorOptions = function (props: any) {
	const editor = useSlateStatic();

	const [currentNode] = findCurrentNodeAtSelection(editor);
	const [toShow, setToShow] = React.useState(false)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [imageProgValue, setImageProgValue] = React.useState(0)
	const ref = React.useRef<any>()


	const handelCloseOptionsWhenOutOfFocus = (e: KeyboardEvent) => {
		if (e.key === "Tab" || e.key === "Enter") return
		setToShow(false)
		setTimeout(() => {
			ReactEditor.focus(editor)
		}, 0);
	}

	React.useLayoutEffect(() => {
		if (!toShow) return
		const firstOptions = document.querySelector("#EDITOR_OPTIONS button") as HTMLButtonElement
		firstOptions?.focus({ preventScroll: true })

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
	return <EditorPortal toShow={toShow} offsets={{ x: 20 }}>
		<VStack id="EDITOR_OPTIONS" rounded="base" minWidth={"200px"} alignItems={"flex-start"} bgColor={"black"} color="white" p={2} >
			{Option("Create code", () => { createCodeBlock(props.editor) }, ref)}
			{Option("Add Image Link", () => { InsertImageButton(props.editor) })}
			{Option("Upload Image", onOpen)}
			{Option("Heading", () => { createHeading(props.editor) })}
		</VStack>

		<Modal isOpen={isOpen && toShow} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Upload Image</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<form onSubmit={(e) => uploadImage(e, setImageProgValue, (imageLink: string) => insertImage(editor, imageLink))}>
						<Input type={"file"} accept="image/png" colorScheme={"linkedin"} />
						<Button size={"sm"} marginBlock={2} type="submit">Upload</Button>
					</form>
					<Progress value={imageProgValue} />
				</ModalBody>
			</ModalContent>


		</Modal>

	</EditorPortal>
}

export default EditorOptions;