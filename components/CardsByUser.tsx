import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Flex, VStack, Badge, Heading, Button, Text, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react'
import { GiMachete } from 'react-icons/gi';
import { useSetRecoilState } from 'recoil';
import { trainCardsAtom } from '../store';
import { isMobile } from '../utils';
import { onDeleteCard } from './editor/editor-events';

import { CardType } from './editor/types';

const CardsByUser = function (props: any) {

	const router = useRouter();
	const setTrainingCardsState = useSetRecoilState(trainCardsAtom)
	const cardBgColor = useColorModeValue('white', 'black');
	const cardTextColor = useColorModeValue('black', 'white');
	const isMobileView = isMobile()
	const onEditorCard = function (id?: string) {
		if (!id) return;
		router.push(`editor/${id}`);
	};

	const onSingleCardTrain = function (card: CardType) {
		setTrainingCardsState(card)
		router.push(`editor/train?mode=single&cardId=${card.id}`)
	}
	if (!props?.cards) return <></>
	return <>
		{props.cards.map((card: CardType) => (
			<Box
				flex='1'
				bg={cardBgColor}
				borderRadius='lg'
				p={2}
				key={card.id}>
				<Flex
					flexDirection={'column'}
					height='full'
					gap={5}
					alignItems='flex-start'
					justifyContent='space-between'>
					<VStack alignItems={'flex-start'} spacing={1}>
						<Badge colorScheme={'facebook'} fontSize={"x-small"} >{card.category}</Badge>
						<Heading color={cardTextColor} fontSize={{ base: "sm", md: "md" }}>
							{card.title}
						</Heading>

						<Text color={cardTextColor} fontSize={{ base: 'xs', sm: 'sm' }}>
							{card.exec}
						</Text>
					</VStack>
					<Flex gap={3} flexWrap="wrap"  >
						<Tooltip hasArrow shouldWrapChildren label={isMobileView ? "edit is disabled on mobile" : ""}>
							<Button
								pointerEvents={"auto"}
								size={'xs'}
								colorScheme="linkedin"
								isDisabled={isMobileView}
								leftIcon={<EditIcon />}
								onClick={() => onEditorCard(card?.id)}>
								Edit
							</Button>
						</Tooltip>
						<Button
							size={'xs'}
							colorScheme="teal"
							disabled={!card.allowTrain}
							leftIcon={<GiMachete />}
							onClick={() => onSingleCardTrain(card)}>
							Train
						</Button>

						<Button
							size={'xs'}
							colorScheme="red"

							leftIcon={<DeleteIcon />}
							onClick={() => onDeleteCard(props.userDataFromDb, props.db, card.id)}>
							Delete
						</Button>

					</Flex>
				</Flex>
			</Box>
		))}
	</>
}

export default CardsByUser;