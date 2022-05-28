import {
	Container, Heading, VStack, useColorModeValue,
	Breadcrumb,
	BreadcrumbItem, Text,
	BreadcrumbLink,
	Link,
	Box,
	Button,
	HStack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Editor from '../../components/editor';
import { CardType } from '../../components/editor/types';
import PrivateRoute from '../../components/PrivateRoute';
import NextLink from 'next/link';
import { EditorMode } from '../../components/editor/editor-utils';

const EditCard = function (props: any) {
	const params = useRouter().query;
	const textColor = useColorModeValue("teal.700", "white")
	const [card, setCard] = React.useState(() => props.userDataFromDb?.cards.find?.(
		(card: CardType) => card.id === params.id
	))
	const [cardIndex, setCardIndex] = React.useState<number>(() => props.userDataFromDb?.cards.findIndex((card: CardType) => card.id === params.id) || 0)

	React.useEffect(() => {
		const card = props.userDataFromDb.cards[cardIndex]
		setCard(card)
		window.history.replaceState(null, "", `/editor/${card.id}`);
	}, [cardIndex, props.userDataFromDb.cards])

	const CardDisplay = () => {
		return <VStack alignItems={'stretch'} spacing={0}>
			<Editor mode={EditorMode.ADD} card={card} {...props} />
		</VStack>
	}

	const NoCardDisplay = () => {
		return <>
			<Heading color={textColor}>No card here :(</Heading>
			<Text>
				Go back
				<NextLink href={'/'}>
					<Link color={'facebook.400'}> Home </Link>
				</NextLink>
				and add some!.
			</Text>
		</>
	}
	return (
		<Container maxW={"container.xl"}>
			<Breadcrumb separator={"-"} marginBlockStart={3}>
				<BreadcrumbItem>
					<NextLink href='/'
					>
						<BreadcrumbLink>Home</BreadcrumbLink>
					</NextLink>
				</BreadcrumbItem>

				<BreadcrumbItem>
					<BreadcrumbLink>Edit Card</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>
			<Container maxW={'container.lg'} p={4}>
				{card ? <CardDisplay /> : <NoCardDisplay />}
				<HStack marginBlockStart={2} justifyContent="space-between">
					<HStack>
						<Button size={"sm"} onClick={() => setCardIndex((c) => c + 1)} id="NEXT_TRAIN_CARD" disabled={cardIndex + 1 === props.userDataFromDb?.cards?.length} >
							Next</Button>
						<Button size={"sm"} id="BACK_TRAIN_CARD" onClick={() => setCardIndex((c) => c - 1)} disabled={cardIndex === 0} >
							Back</Button>
					</HStack>
					<Box backgroundColor={"teal.100"} p={2} rounded={"base"}> {cardIndex + 1} / {props.userDataFromDb?.cards?.length}</Box>
				</HStack>
			</Container>


		</Container>
	);
};

export default PrivateRoute(EditCard);
