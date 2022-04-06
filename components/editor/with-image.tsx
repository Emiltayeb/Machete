/* eslint-disable @next/next/no-img-element */
import { Editor } from "slate"
import React, { useMemo } from 'react'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { Transforms } from 'slate'

type ImageElement = {
	type: 'image'
	url: string
	children: any
}


const withImages = (editor: Editor) => {
	const { insertData, isVoid } = editor

	editor.isVoid = element => {
		return element.type === 'image' ? true : isVoid(element)
	}

	editor.insertData = data => {
		const text = data.getData('text/plain')
		const { files } = data

		if (files && files.length > 0) {
			for (const file of files) {
				const reader = new FileReader()
				const [mime] = file.type.split('/')

				if (mime === 'image') {
					reader.addEventListener('load', () => {
						const url = reader.result
						insertImage(editor, url)
					})

					reader.readAsDataURL(file)
				}
			}
		} else if (isImageUrl(text)) {
			insertImage(editor, text)
		} else {
			insertData(data)
		}
	}

	return editor
}
export default withImages

export const insertImage = (editor: Editor, url: any) => {
	const text = { text: '' }
	const image: ImageElement = { type: 'image', url, children: [text] }
	Transforms.insertNodes(editor, image)
}

const isImageUrl = (url: string) => {
	if (!url) return false
	if (!isUrl(url)) return false
	const ext = new URL(url).pathname.split('.').pop()
	return imageExtensions.includes(ext ?? "")
}


export const InsertImageButton = (editor?: any) => {
	const url = window.prompt('Enter the URL of the image:')
	insertImage(editor, url)
}
