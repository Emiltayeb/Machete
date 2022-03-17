import {
	Container, Heading, VStack, useColorModeValue,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Editor from '../../components/editor';
import PrivateRoute from '../../components/PrivateRoute';
import NextLink from 'next/link';
import { EditorMode } from '../../components/editor/editor-utils';

const NewCard = function (props: any) {

	const textColor = useColorModeValue("teal.700", "white");


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
					<BreadcrumbLink>New card</BreadcrumbLink>
				</BreadcrumbItem>
			</Breadcrumb>

			<Container maxW={'container.lg'} p={4}>
				<VStack alignItems={'stretch'} spacing={0}>
					<Heading color={textColor} > New Card</Heading>
					<Editor mode={EditorMode.ADD} {...props} />
				</VStack>
			</Container>
		</Container>
	);
};

export default PrivateRoute(NewCard);
