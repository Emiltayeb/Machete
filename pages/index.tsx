import React from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Container, Divider, Flex, Grid, Heading, HStack, Input, Select, Text, useBreakpointValue, useColorModeValue, VStack, } from '@chakra-ui/react';
import PrivateRoute from '../components/PrivateRoute';
import CreateCard from '../components/layout/navigation/CreateCard';
import CardsByUser from '../components/CardsByUser';
import { CardType } from '../components/editor/types';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userCategoriesAtom, trainCardsAtom } from '../store';
import { EditorMode } from '../components/editor/editor-utils';
import { usePagination } from '../utils/usePagination';




const HomePage = (props: any) => {
  const textColor = useColorModeValue("teal.700", "white")
  const cardsGridBackground = useColorModeValue('gray.200', 'gray.700');
  const gridTemplateCols = useBreakpointValue({ base: "1fr", md: "repeat(3, minmax(200px, 1fr) )" })
  const userCards: CardType[] = props?.userDataFromDb?.cards;
  const categoriesState = useRecoilValue(userCategoriesAtom)
  const setTrainingCards = useSetRecoilState(trainCardsAtom)
  const [currentCategoryFilter, setCurrentCategoryFilter] = React.useState<any>("all");

  const { pagesBtns, paginatedData, currentPage, setCurrPage, setOriginalData } = usePagination({
    initialData: userCards, initialPage: 0, itemsPerPage: 6
  })
  const router = useRouter()


  React.useEffect(() => {
    setTrainingCards(userCards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  React.useEffect(() => {
    setOriginalData(userCards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCards])

  const setPaginatedData = function (paginatedCards: CardType[]) {
    setCurrPage(0)
    setOriginalData(paginatedCards)
  }



  const onFreeSearchFilter = function (e: React.ChangeEvent<HTMLInputElement>) {
    const filerValue = e.target.value;
    const filteredCards = userCards.filter(card => card.title.toLowerCase().indexOf(filerValue.toLowerCase()) > -1 || card.exec?.toLowerCase().includes(filerValue.toLowerCase()))
    const updatedCards = currentCategoryFilter !== "all" ? filteredCards.filter(card => card.category === currentCategoryFilter) : filteredCards
    setPaginatedData(updatedCards)
    setTrainingCards(filteredCards)
  }

  const onCategoryFilter = function (e: React.ChangeEvent<HTMLSelectElement>) {
    const updatedCards = e.target.value === "all" ? userCards : userCards?.filter(card => card.category === e.target.value)
    setCurrentCategoryFilter(e.target.value)
    setPaginatedData(updatedCards)
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
          <Select onChange={onCategoryFilter} maxW="sm" size={"sm"} flex={1} >
            <option value={'all'} >All</option>
            {categoriesState?.map((cat: string) => <option key={cat}>{cat}</option>)}
          </Select>
          <Text fontSize={"sm"}>Free search:</Text>

          <Input flex={1} variant="flushed" onChange={onFreeSearchFilter} />
          <Button disabled={paginatedData?.length === 0}
            onClick={() => router.push(`editor/train?mode=${EditorMode.MULTIPLE_TRAIN}`)}
            colorScheme="teal" size={"sm"}>
            Train {currentCategoryFilter || "all"} Cards</Button>
        </Flex>
        <Divider />
        <Box
          p={{ base: 2, sm: 5 }}
          minHeight={350}
          width={"full"}
          bg={cardsGridBackground}
          rounded='2xl'>
          <Grid
            gridTemplateColumns={gridTemplateCols}
            gap={5}

          >
            {!!paginatedData?.length ? <CardsByUser {...props} paginatedCards={paginatedData} /> : <Text>No cards..</Text>}
          </Grid>
        </Box>
        <HStack marginBlockStart={10}>
          {pagesBtns.map((btn) => <Button
            isActive={btn === currentPage}
            _active={{ backgroundColor: "teal", color: "white" }}
            onClick={() => setCurrPage(btn)} size={"sm"} key={btn}>{btn + 1}</Button>)}
        </HStack>
      </VStack>


    </Container>
  );
};

export default PrivateRoute(HomePage);
