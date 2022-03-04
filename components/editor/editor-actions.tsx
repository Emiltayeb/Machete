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
} from '@chakra-ui/react';
import React from 'react';
import * as Utils from './editor-utils';
import { CardType } from './types';
import { EditIcon, CheckIcon, ViewIcon } from '@chakra-ui/icons';
type ActionsProps = {
  card: CardType | null | undefined;
  editorMode: Utils.EditorMode;
  allowTrain: boolean;
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
const EditorActions = (props: ActionsProps) => {
  const { editorMode, onCardSave, setEditorMode, card, allowTrain } = props;
  const [isSubmitting, setIsSubmitting] = React.useState(ActionState.READY);
  const [cardDetailState, setCardDetailState] = React.useState({
    title: card?.title ?? '',
    category: card?.category ?? '',
    exec: card?.exec ?? '',
  });
  const toast = useToast();
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

  const updatedCardDetail = function (e: React.ChangeEvent<HTMLInputElement>) {
    setCardDetailState;
    setCardDetailState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Box marginBlockStart={5}>
      <Divider />
      {/* update card data */}
      <Box marginBlockStart={3}>
        <Text fontWeight={'semibold'}>Card Details</Text>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          marginBlockStart={2}
          gap={2}>
          <InputGroup>
            <InputLeftAddon>Title</InputLeftAddon>
            <Input
              type={'text'}
              value={cardDetailState.title}
              name='title'
              placeholder='An important card'
              onChange={(e) => updatedCardDetail(e)}
            />
          </InputGroup>

          <InputGroup>
            <InputLeftAddon>Category</InputLeftAddon>
            <Input
              onChange={(e) => updatedCardDetail(e)}
              value={cardDetailState.category}
              type={'text'}
              name='category'
              placeholder='Things to know...'
            />
          </InputGroup>

          <InputGroup>
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
      </Box>

      <HStack marginBlockStart={3}>
        <Button
          colorScheme={'whatsapp'}
          leftIcon={<CheckIcon />}
          color={'white'}
          disabled={editorMode === Utils.EditorMode.TRAIN}
          isLoading={isSubmitting === ActionState.SUBMITTING}
          onClick={handelCardSave}>
          Save
        </Button>
        <Button
          colorScheme={'linkedin'}
          leftIcon={
            editorMode === Utils.EditorMode.TRAIN ? <EditIcon /> : <ViewIcon />
          }
          color={'white'}
          disabled={editorMode === Utils.EditorMode.ADD && !allowTrain}
          onClick={() =>
            setEditorMode(
              editorMode === Utils.EditorMode.TRAIN
                ? Utils.EditorMode.ADD
                : Utils.EditorMode.TRAIN
            )
          }>
          {editorMode === Utils.EditorMode.TRAIN ? 'Edit' : 'Train'}
        </Button>
      </HStack>
    </Box>
  );
};

export default EditorActions;
