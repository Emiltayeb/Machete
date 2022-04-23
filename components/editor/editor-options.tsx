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
import classes from "./editor-options.module.scss"

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

const selectOptionsButton = (currentIdent: number) => document.querySelector(`#EDITOR_OPTIONS button[data-option *='${currentIdent}']`) as HTMLButtonElement

const EditorOptions = function (props: any) {
	const editor = useSlateStatic();
	const [currentNode] = findCurrentNodeAtSelection(editor);
	const [toShow, setToShow] = React.useState(false)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [imageProgValue, setImageProgValue] = React.useState(0)
	const currentFocusedOption = React.useRef(0);

	const options = [
		{ title: "Creat Code", onClick: () => { createCodeBlock(props.editor) } },
		{ title: "Upload Image", onClick: onOpen },
		{ title: "Add Image Link", onClick: () => { InsertImageButton(props.editor) } },
		{ title: "Heading", onClick: () => { createHeading(props.editor) } }

	]

	const closeOptions = function () {
		setToShow(false)
		setTimeout(() => {
			ReactEditor.focus(editor)
		}, 0);
	}

	const onKeyDown = (e: KeyboardEvent) => {
		e.preventDefault()
		if (e.key === "Enter") {
			selectOptionsButton(currentFocusedOption.current)?.click?.()
			return
		}
		if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
			closeOptions()
			return
		}
		if (e.key === "ArrowDown" && currentFocusedOption.current + 1 < options.length) {
			currentFocusedOption.current = currentFocusedOption.current + 1
		} else if (e.key === "ArrowUp" && currentFocusedOption.current - 1 >= 0) {
			currentFocusedOption.current = currentFocusedOption.current - 1
		}


		selectOptionsButton(currentFocusedOption.current)?.focus?.()
	}

	React.useLayoutEffect(() => {
		if (!toShow) {
			currentFocusedOption.current = 0
			closeOptions()
			return
		}
		selectOptionsButton(currentFocusedOption.current)?.focus({ preventScroll: true })
		window.addEventListener("keydown", onKeyDown)
		return () => { window.removeEventListener("keydown", onKeyDown) }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toShow])


	React.useEffect((() => {
		const isTextMath = currentNode?.[0].text?.match(/\/$/)
		setToShow(!!isTextMath && !getCurrentSelectedText()?.length && currentNode.type !== CustomFormats.REMEMBER_TEXT)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [currentNode?.[0].text, currentNode?.type])


	return <EditorPortal toShow={toShow} offsets={{ x: 20 }}>

		<VStack className={classes.Root} id="EDITOR_OPTIONS" rounded="base" bgColor={"white"} color="black" p={2} >

			{options.map((option, index) => <Button
				className={classes.option} data-option={index} key={index} size={"xs"} onClick={option.onClick}
				_focus={{ background: "blue.200", color: "white" }}
				_hover={{ background: "white", color: "black" }} cursor="pointer">
				{option.title}</Button>)}
		</VStack>

		<Modal isOpen={isOpen && toShow} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Upload Image</ModalHeader>
				<ModalCloseButton />
				<ModalBody width={"fit-content"}>
					<form className={classes.uploadImgForm} onSubmit={(e) => uploadImage(e, setImageProgValue, (imageLink: string) => insertImage(editor, imageLink))}>
						<Input className={classes.uploadImgBtn} type="file" accept="image/png, image/jpeg" />
						<Button size={"sm"} marginBlock={2} type="submit">Upload</Button>
					</form>
					<Progress value={imageProgValue} />
				</ModalBody>
			</ModalContent>


		</Modal>

	</EditorPortal>
}

export default EditorOptions;