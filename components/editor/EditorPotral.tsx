import React from 'react';
import { useRef } from 'react';
import { Portal } from '@chakra-ui/react'

const EditorPortal: React.FC<{ toShow?: boolean }> = (props) => {
	const ref = useRef<HTMLDivElement | null>(null);


	React.useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}
		if (!window || typeof window === undefined) return
		try {
			const domSelection = window.getSelection();
			const domRange = domSelection?.getRangeAt(0);
			const rect = domRange?.getBoundingClientRect();


			if (rect && domSelection) {

				const offset = Math.min(Math.ceil(domSelection.toString().length / 2), 24);
				el.style.display = "unset"
				el.style.position = "absolute"
				el.style.opacity = '1';
				el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
				el.style.left = `${rect.left + window.pageXOffset + rect.width / 2
					}px`;
				el.style.marginInlineStart = `${offset}ch`
			}

		} catch (error) {
			console.log(error);
		}
	});

	return (
		<Portal  >
			{props.toShow ? <div ref={ref}>
				{props.children}
			</div> : <></>}
		</Portal>
	);
};

export default EditorPortal;