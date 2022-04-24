import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Flex, VStack, Badge, Heading, Button, Text, useColorModeValue, Tooltip, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react'
import { GiMachete } from 'react-icons/gi';
import { useSetRecoilState } from 'recoil';
import { trainCardsAtom } from '../store';
import { isMobile } from '../utils';
import { onDeleteCard } from './editor/editor-events';
import { EditorMode } from './editor/editor-utils';
import { CardType } from './editor/types';

enum SubmittingState { READY, SUBMITTING }

type CardProps = {
	card: CardType,
	userDataFromDb: any,
	db: any,
	onCardDelete: (newCards: CardType[]) => void
}
const Card = function (props: CardProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(SubmittingState.READY);
	const cardBgColor = useColorModeValue('white', 'black');
	const cardTextColor = useColorModeValue('black', 'white');
	const isMobileView = isMobile()

	const router = useRouter();
	const setTrainingCardsState = useSetRecoilState(trainCardsAtom)

	const toast = useToast();

	const onEditorCard = function (id?: string) {
		if (!id) return;
		router.push(`editor/${id}`);
	};

	const onSingleCardTrain = function (card: CardType) {
		setTrainingCardsState(card)
		router.push(`editor/train?mode=${EditorMode.SINGLE_TRAIN}&cardId=${card.id}`)
	}

	return <Box
		cursor={"pointer"}
		onClick={async (e) => {

			try {
				const element = (e.target as HTMLElement)?.closest?.("button") as HTMLButtonElement
				const name = element?.getAttribute("name")
				if (!element || name === "edit") {
					onEditorCard(props.card.id)
				}
				else if (name === "delete") {
					setIsSubmitting(SubmittingState.SUBMITTING)
					const updatedCards = await onDeleteCard(props.userDataFromDb, props.db, props.card.id)
					props.onCardDelete?.(updatedCards)
					toast({ status: 'success', title: 'Card Deleted' });
				} else if (name === "train") {
					onSingleCardTrain(props.card)
				}
			} finally {
				setIsSubmitting(SubmittingState.READY)
			}
		}}
		flex='1'
		bg={cardBgColor}
		borderRadius='lg'
		p={2}
		key={props.card.id}>
		<Flex
			flexDirection={'column'}
			height='full'
			gap={5}
			alignItems='flex-start'
			justifyContent='space-between'>
			<VStack alignItems={'flex-start'} spacing={1}>
				<Badge colorScheme={'facebook'} fontSize={"x-small"} >{props.card.category}</Badge>
				<Heading color={cardTextColor} fontSize={{ base: "sm", md: "md" }}>
					{props.card.title}
				</Heading>

				<Text color={cardTextColor} fontSize={{ base: 'xs', sm: 'sm' }}>
					{props.card.exec}
				</Text>
			</VStack>
			<Flex gap={3} flexWrap="wrap"  >
				<Tooltip hasArrow shouldWrapChildren label={isMobileView ? "edit is disabled on mobile" : ""}>
					<Button
						pointerEvents={"auto"}
						size={'xs'}
						name="edit"
						colorScheme="linkedin"
						isDisabled={isMobileView}
						leftIcon={<EditIcon />}
					>
						Edit
					</Button>
				</Tooltip>
				<Button
					size={'xs'}
					name="train"
					colorScheme="teal"
					disabled={!props.card.allowTrain}
					leftIcon={<GiMachete />}
				>
					Train
				</Button>

				<Button
					size={'xs'}
					colorScheme="red"
					name="delete"
					isLoading={isSubmitting === SubmittingState.SUBMITTING}
					leftIcon={<DeleteIcon />}
				>
					Delete
				</Button>

			</Flex>
		</Flex>
	</Box>

}
const CardsByUser = function (props: any) {
	if (!props?.paginatedCards) return <></>
	return props.paginatedCards.map((card: CardType) => <Card  {...props} onCardDelete={props.onDeleteCard} card={card} key={card.id} />)
}

export default CardsByUser;