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
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Portal
} from '@chakra-ui/react';
import React from 'react';
import * as Utils from './editor-utils';
import { CardType } from './types';
import { CheckIcon, ViewIcon, InfoIcon } from '@chakra-ui/icons';
import FocusLock from "react-focus-lock"


type ActionsProps = {
  card: CardType | null | undefined;
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
const EditorActions = (props: ActionsProps) => {
  const { editorMode, onCardSave, setEditorMode, card } = props;
  const [isSubmitting, setIsSubmitting] = React.useState(ActionState.READY);
  const [cardDetailState, setCardDetailState] = React.useState({
    title: card?.title ?? '',
    category: card?.category ?? '',
    exec: card?.exec ?? '',
  });
  const firstFieldRef = React.useRef(null)
  const { onOpen, onClose, isOpen } = useDisclosure()
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
    setCardDetailState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const CardDetailsForm = function () {
    return <>
      <Text fontWeight={'semibold'}>Card Details</Text>
      <Flex
        direction={"column"}

        gap={2}>
        <InputGroup>
          <InputLeftAddon>Title</InputLeftAddon>
          <Input
            ref={firstFieldRef}
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
    </>
  }


  return (
    <Box marginBlockStart={5}>
      <Divider />
      <Box marginBlockStart={3}>
        {
          editorMode === Utils.EditorMode.ADD ?
            <HStack>
              <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                placement='top'
                closeOnBlur
                initialFocusRef={firstFieldRef}

              >
                <PopoverTrigger>
                  <Button size={"sm"} leftIcon={<InfoIcon />} colorScheme="yellow">
                    Card Details
                  </Button>
                </PopoverTrigger>
                <Portal >
                  <PopoverContent p={5} width="unset" margin="0 auto">
                    <FocusLock returnFocus persistentFocus={false}>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      {CardDetailsForm()}
                    </FocusLock>
                  </PopoverContent>
                </Portal>
              </Popover>


              <Button
                size={"sm"}
                colorScheme={'whatsapp'}
                leftIcon={<CheckIcon />}
                isLoading={isSubmitting === ActionState.SUBMITTING}
                onClick={handelCardSave}>
                Save
              </Button>

            </HStack> :
            <Button colorScheme="linkedin" onClick={() => setEditorMode(Utils.EditorMode.ADD)}> Edit</Button>
        }
      </Box>



    </Box>
  );
};

export default EditorActions;
