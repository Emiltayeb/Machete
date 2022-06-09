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
import { useRecoilState } from 'recoil';
import { userCategoriesAtom } from '../../../store';
import { isMobile } from '../../../utils';
import PrivateRoute from '../../PrivateRoute';
import { onCardSave, onCardCategoryChange } from "../editor-events"
import { Editor } from 'slate';
import { useRouter } from 'next/router';
import { SLATE_EDITOR_ID } from '..';
import { createGlobalStyle } from 'styled-components';

type ActionsProps = {
  cardText: string;
  card: CardType | undefined | null;
  editorMode: Utils.EditorMode;
  setEditorMode: any;
  userCards?: CardType[];
  userDataFromDb: any;
  db: any;
  codeLanguages: any
  editor: Editor;
};


enum ActionState {
  SUBMITTING,
  READY,
}

enum CategoryState { NEW, EXISTING, UPDATE }

const EditorActions = (props: ActionsProps) => {
  const { editorMode, setEditorMode, card, db, userDataFromDb } = props;


  const [userCategoriesState, setUserCategoriesState] = useRecoilState(userCategoriesAtom)
  const [isSubmitting, setIsSubmitting] = React.useState(ActionState.READY);
  const [categoryState, setCategoryState] = React.useState(userCategoriesState.length > 0 || card?.category ? CategoryState.EXISTING : CategoryState.NEW);
  const toast = useToast();
  const isMobileView = isMobile()
  const [cardDetailState, setCardDetailState] = React.useState({
    title: card?.title ?? '',
    category: card?.category ?? userCategoriesState[0] ?? props.userCards?.[0]?.category ?? "",
    exec: card?.exec ?? '',
  });
  const categoryRef = React.useRef<any>(cardDetailState.category)

  const isCategoryInvalid = categoryState === CategoryState.NEW && cardDetailState.category == ""
  const isInvalidForm = cardDetailState.title === "" || isCategoryInvalid || props.card?.text.length === 0
  const allowTrain = React.useRef(props.card?.allowTrain)

  React.useEffect(() => {
    allowTrain.current = !!document.querySelector('[data-remember-text]')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  const handelCardSave = async function () {
    setIsSubmitting(ActionState.SUBMITTING);
    const cardData = {
      text: JSON.stringify(props.editor.children),
      id: props?.card?.id,
      ...cardDetailState,
      allowTrain: !!allowTrain.current,
    }

    try {
      await onCardSave(cardData, userDataFromDb, db, (id) => {
        if (props.card?.id) return;
        window.history.replaceState(null, "", `/editor/${id}`)
      });
      toast({ status: 'success', title: 'Card saved.' });
    } catch (error) {
      console.log(error)
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
      await onCardCategoryChange(userDataFromDb, db, categoryRef.current, cardDetailState.category)
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
      flex={2}
      gap={2}>
      <FormControl isInvalid={cardDetailState.title == ""}>
        <InputGroup size={"xs"}>
          <InputLeftAddon>Title</InputLeftAddon>
          <Input
            required
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


  const onTrainClick = function () {
    setEditorMode(Utils.EditorMode.TRAIN)
    window.history.pushState(null, 'EDitor train', `/editor/train/?mode=${Utils.EditorMode.SINGLE_TRAIN}&cardId=${props.card?.id}`);
  }

  return (

    <Box marginBlockStart={3}>
      {
        editorMode === Utils.EditorMode.ADD ?
          <HStack wrap={{ base: "wrap", md: "nowrap" }} gap={{ base: 2, md: 0 }}>
            {CardDetailsForm()}
            <Button
              isDisabled={isInvalidForm || isSubmitting === ActionState.SUBMITTING}
              size={"xs"}
              colorScheme={'whatsapp'}
              leftIcon={<CheckIcon />}
              isLoading={isSubmitting === ActionState.SUBMITTING}
              onClick={handelCardSave}>
              Save
            </Button>
            <Button
              isDisabled={isInvalidForm || !props.card?.allowTrain}
              size={"xs"}
              colorScheme={'teal'}
              onClick={onTrainClick}>
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

export default PrivateRoute(EditorActions);
