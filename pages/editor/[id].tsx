import {
	Container, Heading, VStack, useColorModeValue,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Editor from '../../components/editor';
import { CardType } from '../../components/editor/types';
import PrivateRoute from '../../components/PrivateRoute';
import NextLink from 'next/link';
import { useRecoilValue } from 'recoil';
import { trainCardsAtom } from '../../store';
import { EditorMode } from '../../components/editor/editor-utils';

const EditCard = function (props: any) {
	const params = useRouter().query;
	const textColor = useColorModeValue("teal.700", "white")

	const card = props.userDataFromDb?.cards.find?.(
		(card: CardType) => card.id === params.id
	);

	if (!card) {
		return <></>;
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

				<VStack alignItems={'stretch'} spacing={0}>

					<Heading color={textColor} > Edit Card</Heading>

					<Editor mode={EditorMode.ADD} card={card} {...props} />
				</VStack>
			</Container>
		</Container>
	);
};

export default PrivateRoute(EditCard);
