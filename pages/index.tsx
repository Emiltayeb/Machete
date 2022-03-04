import React from 'react';
import { useRouter } from 'next/router';
import { CardType } from '../components/editor/types';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Text,
  useBreakpoint,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import PrivateRoute from '../components/PrivateRoute';
import { onDeleteCard } from '../components/editor/editor-events';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { GiMachete } from "react-icons/gi";
import { EditorMode } from '../components/editor/editor-utils';
import CreateCard from '../components/layout/navigation/CreateCard';

const Login = (props: any) => {
  const router = useRouter();
  const textColor = useColorModeValue("teal.700", "white")
  const cardBgColor = useColorModeValue('gray.300', 'gray.700');
  const gridTemplateCols = useBreakpointValue({ base: "1fr", md: "repeat(3, minmax(150px, 1fr) )" })

  const onCardClick = function (id?: string) {
    if (!id) return;
    router.push(`editor/${id}`);
  };

  return (
    <Container maxW={'container.xl'}>
      <VStack alignItems={'flex-start'} spacing={1}>
        <Heading
          color={textColor}
          marginBlockStart={5}
          fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}>
          Welcome {props.user?.displayName || props.user?.email}
        </Heading>
        <Text fontSize={{ base: 'small', sm: 'xl' }}>
          Here you can view your cards or you can{' '}
          <CreateCard />
        </Text>
      </VStack>
      <Box
        p={{ base: 2, sm: 5, md: 10 }}
        bg={cardBgColor}
        marginBlock={7}
        rounded='2xl'>
        <Grid
          gridTemplateColumns={gridTemplateCols}
          gap={5}
        >

          {props.userDataFromDb?.cards?.map((card: CardType) => (
            <Box
              flex='1'
              bg={'white'}
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
                  <Heading color={'black'} fontSize={{ base: "sm", md: "md" }}>
                    {card.title}
                  </Heading>

                  <Text color={'black'} fontSize={{ base: 'xs', sm: 'sm' }}>
                    {card.exec}
                  </Text>
                </VStack>
                <Flex gap={3} flexWrap="wrap" >
                  <Button
                    size={'xs'}
                    colorScheme="linkedin"
                    leftIcon={<EditIcon />}

                    onClick={() => onCardClick(card?.id)}>
                    Edit
                  </Button>
                  <Button
                    size={'xs'}
                    colorScheme="red"

                    leftIcon={<DeleteIcon />}
                    onClick={() => onDeleteCard(props.userDataFromDb, props.db, card.id)}>
                    Delete
                  </Button>
                  <Button
                    size={'xs'}
                    colorScheme="linkedin"
                    disabled={!card.allowTrain}
                    leftIcon={<GiMachete />}
                    onClick={() => { router.push(`editor/${card.id}?mode=${EditorMode.TRAIN}`); }}>
                    Train
                  </Button>

                </Flex>
              </Flex>
            </Box>
          ))}
        </Grid>

      </Box>


    </Container>
  );
};

export default PrivateRoute(Login);
