import {
  HStack,
  Button,
  useToast,
  Input,
  Box,
  Text,
  InputGroup,
  InputLeftAddon,
  Divider,
  Flex,
  FormControl,
  Select,
  IconButton,
} from '@chakra-ui/react';
import React from 'react';
import * as Utils from './editor-utils';
import { CardType } from './types';
import { ArrowBackIcon, CheckIcon, EditIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import { userCategoriesAtom } from '../../store';
import ReactFocusLock from 'react-focus-lock';


type ActionsProps = {
  cardText: string;
  card: CardType | undefined | null;
  editorMode: Utils.EditorMode;
  onCardSave: ({
    title,
    exec,
    category,
  }: {
    title: string;
    category: string;
    exec?: string;
  }) => void;
  setEditorMode: any;
};


enum ActionState {
  SUBMITTING,
  READY,
}

enum CategoryState { NEW, EXISTING }

const EditorActions = (props: ActionsProps) => {
  const { editorMode, onCardSave, setEditorMode, card } = props;
  const userCategories = useRecoilValue(userCategoriesAtom)
  const [isSubmitting, setIsSubmitting] = React.useState(ActionState.READY);
  const [categoryState, setCategoryState] = React.useState(CategoryState.EXISTING);
  const toast = useToast();


  const [cardDetailState, setCardDetailState] = React.useState({

    title: card?.title ?? '',
    category: card?.category ?? userCategories[0] ?? "",
    exec: card?.exec ?? '',
  });

  const isCategoryInvalid = categoryState === CategoryState.NEW && cardDetailState.category == ""
  const isInvalidForm = cardDetailState.title === "" || isCategoryInvalid || props.cardText.length === 0


  const handelCardSave = async function () {
    setIsSubmitting(ActionState.SUBMITTING);
    try {
      await onCardSave(cardDetailState);
      toast({ status: 'success', title: 'Card saved.' });
    } catch (error) {
      toast({ status: 'error', title: 'Ops. card not saved' });
    } finally {
      setIsSubmitting(ActionState.READY);
    }
  };
  const updatedCardDetail = function (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setCardDetailState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handelSelectCategory = function (e: React.ChangeEvent<HTMLSelectElement>) {
    const filterVal = e.target.value;
    if (filterVal === "new") {
      setCategoryState(CategoryState.NEW)
    } else {
      categoryState === CategoryState.NEW && setCategoryState(CategoryState.EXISTING)
      updatedCardDetail(e)
    }
  }

  const CardDetailsForm = function () {
    return <Flex
      wrap={{ base: "wrap", md: "nowrap" }}
      gap={2}>
      <FormControl isInvalid={cardDetailState.title == ""}>
        <InputGroup size={"xs"}>
          <InputLeftAddon>Title</InputLeftAddon>
          <Input

            required
            autoFocus
            type={'text'}
            value={cardDetailState.title}
            name='title'
            placeholder='An important card'
            onChange={(e) => updatedCardDetail(e)}
          />
        </InputGroup>
      </FormControl>

      <FormControl isInvalid={isCategoryInvalid}>
        <InputGroup size={"xs"} alignItems="self-end">
          <InputLeftAddon>Category</InputLeftAddon>
          {categoryState === CategoryState.NEW ? <>

            <Input
              size={"xs"}
              onChange={(e) => updatedCardDetail(e)}
              value={cardDetailState.category}
              type={'text'}
              name='category'
              placeholder='Things to know...'
            />

            <IconButton size={'xs'} aria-label='back to list' icon={<ArrowBackIcon />} onClick={() => setCategoryState(CategoryState.EXISTING)} />
          </> : <Select size={"xs"} name='category' onChange={handelSelectCategory} >
            {userCategories?.map((cat: string, index: number) => <option selected={index == 0} key={cat}>{cat}</option>)}
            <option value="new"> + Add Category</option>
          </Select>}


        </InputGroup>
      </FormControl>

      <InputGroup size={"xs"}>
        <InputLeftAddon>Exec</InputLeftAddon>
        <Input
          onChange={(e) => updatedCardDetail(e)}
          type={'text'}
          value={cardDetailState.exec}
          name='exec'
          placeholder='Learn how to..'
        />
      </InputGroup>
    </Flex>
  }


  return (
    <Box marginBlockStart={5}>
      <Divider />
      <Box marginBlockStart={3}>
        {
          editorMode === Utils.EditorMode.ADD ?
            <HStack wrap={{ base: "wrap", md: "nowrap" }} gap={{ base: 2, md: 0 }}>
              {CardDetailsForm()}
              <Button
                isDisabled={isInvalidForm}
                size={"xs"}
                colorScheme={'whatsapp'}

                leftIcon={<CheckIcon />}
                isLoading={isSubmitting === ActionState.SUBMITTING}
                onClick={handelCardSave}>
                Save
              </Button>

            </HStack> :
            <Button size="xs" colorScheme="linkedin" leftIcon={<EditIcon />} onClick={() => setEditorMode(Utils.EditorMode.ADD)}> Edit</Button>
        }
      </Box>



    </Box>
  );
};

export default EditorActions;
