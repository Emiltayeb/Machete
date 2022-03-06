import { Button, useBreakpointValue } from '@chakra-ui/react';
import router, { useRouter } from 'next/router';
import React from 'react'
const CreateCard = function () {
	const router = useRouter();
	const mobileOrDesktopSize = useBreakpointValue({ base: "xs", sm: "sm" })

	return <Button border={"1px solid transparent"} size={mobileOrDesktopSize}
		bgColor="whatsapp.700" color={"white"}
		_hover={{ bg: "white", color: "teal.700", borderColor: "black" }}
		onClick={() => router.push("editor/")}>Create Card</Button>
}

export default CreateCard;