import { Editor, Transforms } from "slate";
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
			if (shiftKey) {
				Transforms.insertNodes(editor, [
					{
						type: 'block',
						children: [{ text: ' ' }],
					},
				]);
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
	const block = Editor.above(editor, {
		match: (n) => Editor.isBlock(editor, n),
	});

	if (block) {
		const [blockNode, path] = block;
		const codeRegex = blockNode?.children?.[0]?.text.match(/`{3}([a-z]*)/);
		const lang = codeRegex?.[1].toLocaleUpperCase() as any

		if (lang) {
			editor.deleteBackward('word');
			Transforms.insertNodes(editor, [
				{
					type: 'code',
					children: [{ text: '' }],
				},
			]);
			console.log(path)
			setLanguage(Utils.CodeLanguages?.[lang] || Utils.CodeLanguages.PLAIN_TEXT as Utils.CodeLanguages);
		}
	}
};