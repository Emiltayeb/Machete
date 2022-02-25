import { Editor, Transforms, Node, Text } from "slate";
import { ReactEditor } from "slate-react";
import * as Utils from "./editor-utils";

let isAllChildrenSelected = false;

export const handelKeyDown = function (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor) {
	const { key, shiftKey, ctrlKey, metaKey } = event;

	switch (key) {
		case "Backspace":
			if (isAllChildrenSelected) {
				Transforms.delete(editor)
				Transforms.setNodes(editor, {
					text: " "
					, type: "span"
				})
				isAllChildrenSelected = false
			}
			break
		case "Enter":

			// find current  node
			const [match] = Utils.findCurrentNodeAtSelection(editor)
			// find the parent (code block?)
			const [node] = Editor.parent(editor, match[1]) as any


			if (node.type === 'code') {
				event.preventDefault()
				if (shiftKey) {
					// TODO: Insert Soft-Break!
					editor.insertText("\n")
					break;
				}
				Transforms.insertNodes(editor, { type: "block", children: [{ text: "" }] })

			}

			break;
		case "a":
			if (metaKey || ctrlKey) {
				isAllChildrenSelected = true
			}
		default:
			break;
	}

}

export const handelCreatCodeBlock = function (editor: Editor, setLanguage: any) {

	const [currentNode] = Utils.findCurrentNodeAtSelection(editor)
	if (!currentNode) return

	const codeRegex = currentNode[0].text?.match(/`{3}([a-z]*)/);
	const lang = codeRegex?.[1].toLocaleUpperCase() as any

	if (lang) {
		editor.deleteBackward('word');
		Transforms.insertFragment(editor, [{ type: "code", children: [{ text: "" }] }])
		setLanguage((prev) => [...prev, Utils.CodeLanguages?.[lang] || Utils.CodeLanguages.PLAIN_TEXT as Utils.CodeLanguages]);
	}

};