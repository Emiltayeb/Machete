import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import PrivateRoute from '../components/PrivateRoute';
import CreateCard from '../components/layout/navigation/CreateCard';
import CardsByUser from '../components/CardsByUser';
import { CardType } from '../components/editor/types';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userCategoriesAtom, trainCardsAtom } from '../store';

const HomePage = (props: any) => {
  const textColor = useColorModeValue("teal.700", "white")
  const cardBgColor = useColorModeValue('gray.300', 'gray.700');
  const gridTemplateCols = useBreakpointValue({ base: "1fr", md: "repeat(3, minmax(150px, 1fr) )" })
  const userCards: CardType[] = props?.userDataFromDb?.cards;
  const [filteredCards, setFilteredCards] = React.useState<CardType[] | undefined>(props?.userDataFromDb?.cards)
  const categoriesState = useRecoilValue(userCategoriesAtom)
  const setTrainingCards = useSetRecoilState(trainCardsAtom)
  const currentCategoryFilter = React.useRef<any>("all");
  const router = useRouter()
  // changes from firebaes (delete,add..)

  React.useEffect(() => {
    setFilteredCards(currentCategoryFilter.current.value !== "all" ? props?.userDataFromDb?.cards.filter((card: CardType) => card.category === currentCategoryFilter.current.value)
      : props?.userDataFromDb?.cards)
    console.log(props?.userDataFromDb?.cards)
    setTrainingCards(props?.userDataFromDb?.cards.filter((card: CardType) => card.allowTrain))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.userDataFromDb?.cards])

  const onCategoryFilter = function (e: React.ChangeEvent<HTMLSelectElement>) {
    const updatedCards = e.target.value === "all" ? userCards : userCards?.filter(card => card.category === e.target.value)
    setFilteredCards(updatedCards)
    setTrainingCards(updatedCards)
  }

  const onFreeSearchFilter = function (e: React.ChangeEvent<HTMLInputElement>) {
    const filerValue = e.target.value;
    const filteredCards = userCards.filter(card => card.title.toLowerCase().indexOf(filerValue.toLowerCase()) > -1 || card.exec?.toLowerCase().includes(filerValue.toLowerCase()))
    const updatedCards = currentCategoryFilter.current.value !== "all" ? filteredCards.filter(card => card.category === currentCategoryFilter.current.value) : filteredCards
    setFilteredCards(updatedCards)
    setTrainingCards(updatedCards)
  }
  return (
    <Container maxW={'container.xl'}>
      <VStack alignItems={'flex-start'} spacing={2}>
        <Heading
          color={textColor}
          marginBlockStart={5}
          maxInlineSize="unset"
          fontSize={{ base: 'xl', sm: 'xl', md: '2xl' }}>
          Welcome to machete {props.user?.displayName || props.user?.email}
        </Heading>
        <Flex alignItems={"center"} gap={2} wrap="wrap">
          <Text fontSize={{ base: 'small', sm: 'md' }}>
            Here you can edit, train or
          </Text>
          <CreateCard />
        </Flex>
      </VStack>


      <VStack marginBlock={14} alignItems='flex-start'>
        <Flex width={"full"} alignItems={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} wrap={"wrap"} gap={2} >
          <Text fontSize={"sm"}>Category:</Text>
          <Select onChange={onCategoryFilter} maxW="sm" size={"sm"} flex={1} ref={currentCategoryFilter}>
            <option value={'all'} >All</option>
            {categoriesState?.map((cat: string) => <option key={cat}>{cat}</option>)}
          </Select>
          <Text fontSize={"sm"}>Free search:</Text>

          <Input flex={1} variant="flushed" onChange={onFreeSearchFilter} />
          <Button disabled={filteredCards?.length === 0}
            onClick={() => router.push("editor/train?mode=multiple")}
            colorScheme="teal" size={"sm"}>
            Train {currentCategoryFilter.current?.value || "all"} Cards</Button>
        </Flex>
        <Divider />
        <Box
          p={{ base: 2, sm: 5, md: 10 }}
          bg={cardBgColor}
          rounded='2xl'>
          <Grid
            gridTemplateColumns={gridTemplateCols}
            gap={5}
          >
            {!!filteredCards?.length ? <CardsByUser {...props} cards={filteredCards} /> : <Text>No cards..</Text>}
          </Grid>

        </Box>
      </VStack>



    </Container>
  );
};

export default PrivateRoute(HomePage);
