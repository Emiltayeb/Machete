import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import React from 'react'
const OffLineModal = function () {
	const { isOpen, onOpen, onClose, } = useDisclosure()

	// React.useEffect(() => {
	// 	if (window === undefined || typeof window === undefined) return
	// 	if (window?.navigator.onLine) return
	// 	onOpen()
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [window?.navigator.onLine])
	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Hey! your offline..</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						Check your internet connection and try to refresh the page.
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}

export default OffLineModal;