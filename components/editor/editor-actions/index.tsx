import {
  HStack,
  Button,
  useToast,
  Input,
  Box,
  InputGroup,
  InputLeftAddon,
  Flex,
  FormControl,
  Select,
  IconButton,
  InputRightAddon,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import * as Utils from '../editor-utils';
import { CardType } from '../types';
import { ArrowBackIcon, CheckIcon, EditIcon } from '@chakra-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userCategoriesAtom } from '../../../store';
import { isMobile } from '../../../utils';

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
  onCategorySave: any;
  setEditorMode: any;
  userCards?: CardType[]
};


enum ActionState {
  SUBMITTING,
  READY,
}

enum CategoryState { NEW, EXISTING, UPDATE }

const EditorActions = (props: ActionsProps) => {
  const { editorMode, onCardSave, setEditorMode, card } = props;
  const [userCategoriesState, setUserCategoriesState] = useRecoilState(userCategoriesAtom)
  const [isSubmitting, setIsSubmitting] = React.useState(ActionState.READY);
  const [categoryState, setCategoryState] = React.useState(userCategoriesState.length > 0 || card?.category ? CategoryState.EXISTING : CategoryState.NEW);
  const toast = useToast();
  const isMobileView = isMobile()
  console.log(card?.category)
  const [cardDetailState, setCardDetailState] = React.useState({
    title: card?.title ?? '',
    category: card?.category ?? userCategoriesState[0] ?? props.userCards?.[0]?.category ?? "",
    exec: card?.exec ?? '',
  });
  const categoryRef = React.useRef<any>(cardDetailState.category)

  const isCategoryInvalid = categoryState === CategoryState.NEW && cardDetailState.category == ""
  const isInvalidForm = cardDetailState.title === "" || isCategoryInvalid || props.card?.text.length === 0
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


  const editCardCategory = async function () {
    setIsSubmitting(ActionState.SUBMITTING);
    try {
      const updatedCategories = userCategoriesState.map((cat) => cat === categoryRef.current ? cardDetailState.category : cat)
      // 1 update current.
      setUserCategoriesState(updatedCategories as any)
      // 2 take all the current user card and update thier catgories as well?
      await props.onCategorySave(categoryRef.current, cardDetailState.category)
      toast({ status: 'success', title: 'Card saved.' });
    } catch (error) {
      toast({ status: 'error', title: 'Card not saved.' });
    } finally {
      setIsSubmitting(ActionState.READY);
    }
  }
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
      categoryRef.current = e.target.value
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
          {categoryState === CategoryState.NEW || categoryState === CategoryState.UPDATE ? <>
            <Input
              size={"xs"}
              onChange={(e) => updatedCardDetail(e)}
              value={cardDetailState.category}
              type={'text'}
              name='category'
              placeholder='Things to know...'
            />
            <IconButton disabled={userCategoriesState.length === 0} bgColor={categoryState === CategoryState.UPDATE ? 'whatsapp.400' : ""} size={'xs'} aria-label='back to list'
              icon={categoryState === CategoryState.NEW ? <ArrowBackIcon /> : <CheckIcon />}
              onClick={() => categoryState === CategoryState.UPDATE ? editCardCategory() : setCategoryState(CategoryState.EXISTING)} />
            {
              categoryState === CategoryState.UPDATE && <>
                <IconButton disabled={userCategoriesState.length === 0} size={'xs'} aria-label='back to list'
                  icon={<ArrowBackIcon />}
                  onClick={() => setCategoryState(CategoryState.EXISTING)} />
              </>
            }
          </> : <>
            <Select size={"xs"} name='category' onChange={handelSelectCategory} defaultValue={card?.category} >
              {userCategoriesState?.map((cat: string, index: number) => <option key={cat}>{cat}</option>)}
              <option value="new"> + Add Category</option>
            </Select>
            <InputRightAddon>
              <IconButton disabled={userCategoriesState.length === 0} size={'xs'} aria-label='Edit' icon={<EditIcon />}
                onClick={() => setCategoryState(CategoryState.UPDATE)} />
            </InputRightAddon>
          </>}


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
            <Button
              isDisabled={isInvalidForm}
              size={"xs"}
              colorScheme={'teal'}
              onClick={() => setEditorMode(Utils.EditorMode.TRAIN)}>
              Train
            </Button>
          </HStack> :
          <Tooltip hasArrow shouldWrapChildren label={isMobileView ? "edit is disabled on mobile" : ""}>
            <Button size="xs" colorScheme="linkedin"
              disabled={isMobileView}
              leftIcon={<EditIcon />} onClick={() => setEditorMode(Utils.EditorMode.ADD)}>
              Edit
            </Button>
          </Tooltip>
      }
    </Box >




  );
};

export default EditorActions;
