
import React from 'react';
import { css } from '@emotion/css';
import { Descendant, Editor, Transforms } from 'slate';
import { CodeLanguages, EditorMode, selectCurrentNode } from '../editor-utils';
import { Text, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Box, Portal, useDisclosure } from '@chakra-ui/react';
import { findDiff } from '../../../utils/getStringDiffrences';
import classes from "./custom-slate-components.module.scss";
import ReactFocusLock from 'react-focus-lock';

// initial editor values (new user - no cards)
export const initialValue: Descendant[] = [
	{
		type: 'block',
		children: [{ text: '', type: "span" }],
	},
];

const CodeCss = (leaf: any) =>
	`${leaf.comment
		? css`
          color: slategray;
        `
		: ''
		}
      ${leaf.property
			? css`
              color: var(--green-6);
            `
			: ''
		} 
        ${leaf.builtin
			? css`
                color: var(--green-6);
              `
			: ''
		}
        ${leaf.operator || leaf.url
			? css`
                color: #9a6e3a;
              `
			: ''
		}
        ${leaf.keyword
			? css`
                color: #07a;
              `
			: ''
		}
        ${leaf.variable || leaf.regex
			? css`
                color: #e90;
              `
			: ''
		}
        ${leaf.number ||
			leaf.boolean ||
			leaf.tag ||
			leaf.constant ||
			leaf.symbol ||
			leaf['attr-name'] ||
			leaf.selector
			? css`
                color: #905;
              `
			: ''
		}
        ${leaf.punctuation
			? css`
                color: #999;
              `
			: ''
		}
        ${leaf.string || leaf.char
			? css`
                color: #690;
              `
			: ''
		}
        ${leaf.function || leaf['class-name']
			? css`
                color: #dd4a68;
              `
			: ''
		}
    `.trim();

// Elements - basically a block
export const CodeElement = (props: any) => {

	const [selectedLang, setSelectedLag] = React.useState(CodeLanguages.HTML)

	// when changing the code lang - it currently adds the lang to our state
	//  and then the decorate paints it all.
	// so the select is a little misleading after changing it a few times
	React.useEffect(() => {
		props.setLanguage?.((prev: Array<keyof typeof CodeLanguages>) => {
			if (
				prev.includes(
					selectedLang.toLocaleLowerCase() as keyof typeof CodeLanguages
				)
			) {
				return prev;
			}
			return [
				...prev,
				selectedLang || CodeLanguages.PLAIN_TEXT,
			];
		});
	}, [selectedLang])



	return <pre {...props.attributes} className={classes.codeElement} >
		<select name="code-lang" onChange={(e) => setSelectedLag(CodeLanguages[e.target.value.toLocaleUpperCase() as keyof typeof CodeLanguages])}
			className={classes.codeLangs}
		>	{Object.keys(CodeLanguages).map((lang) => <option key={lang}>{lang.toLowerCase()}</option>)}
		</select>
		{props.children}
	</pre >;
};

export const DefaultElement = (props: any) => {
	return <p {...props.attributes}>{props.children}</p>;
};


// leaf - is text node
export const Leaf = (props: any) => {
	let { attributes, children, leaf, editorMode, editor } = props;


	if (leaf.bold) {
		children = (
			<strong
				data-slate-custom-leaf='true'
				onClick={() => selectCurrentNode(editor)}>
				{children}
			</strong>
		);
	}

	if (leaf.marker) {
		children = (
			<span
				data-slate-custom-leaf='true'
				className={classes.marker}
				onClick={() => selectCurrentNode(editor)}>
				{children}
			</span>
		);
	}

	if (leaf.rememberText) {
		children =
			editorMode === EditorMode.TRAIN ? (
				<TrainingInput {...props} />
			) : (
				<span
					data-slate-custom-leaf='true'
					data-remember-text='true'
					className={classes.rememberText}
					onClick={() => selectCurrentNode(editor)}>
					{children}
				</span>
			);

	}
	return (
		<span {...attributes} className={CodeCss(leaf)}>
			{children}
		</span>
	);
};


// Handel the training input.
export const TrainingInput = (props: any) => {
	const [answerStatus, setAnswerStatus] = React.useState({
		answered: false,
		status: false,
		differences: "",
	});
	const [inputState, setInputState] = React.useState<string>('');
	const { onClose, onOpen, isOpen } = useDisclosure()
	const correctText = props.leaf.text.trim();



	const handelSubmit = function (e: React.KeyboardEvent<HTMLSpanElement>) {
		if (e.shiftKey && e.key === 'Enter') {
			return;
		}
		if (e.key !== 'Enter') return;

		setAnswerStatus({ status: inputState === correctText, answered: true, differences: findDiff(correctText, inputState) });
		onOpen()

	};

	return (
		<span
			{...props.attributes}
			onKeyPress={handelSubmit}
			className={classes.training_card}>
			<Popover
				onClose={onClose}
				placement='bottom' isOpen={isOpen} closeOnBlur closeOnEsc returnFocusOnClose={false}>
				<PopoverTrigger>
					<Input
						onClick={() => answerStatus.answered && onOpen()}
						bg={'linkedin.400'}
						pl={3}
						data-answered={answerStatus.answered}
						data-correct={answerStatus.status}
						placeholder='...'
						type='text'
						value={inputState}
						style={{
							width: `${inputState.length + 2}ch`,
							height: 'auto',
						}}
						onChange={(e) =>
							!answerStatus.answered && setInputState(e.target.value)
						}
						className={classes.train_input}
					/>
				</PopoverTrigger>
				<Portal >
					<PopoverContent width={"auto"}>
						<PopoverArrow />
						<PopoverCloseButton />
						<PopoverBody>
							<Text color={answerStatus.status ? "whatsapp.400" : "red.400"}><Text fontWeight={"bold"} as="span">Submission</Text>  - {inputState}</Text>
							<Text color={"whatsapp.400"}> <Text as="span" fontWeight={"bold"}>Correct answer</Text> - {props.leaf.text.trim()}</Text>
							{answerStatus.differences.length > 0 && <Text color="yellow.400"><Text as="span" fontWeight={"bold"} >Differences</Text> - {answerStatus.differences}</Text>}
						</PopoverBody>
					</PopoverContent>
				</Portal>
			</Popover >
		</span>
	);
};

