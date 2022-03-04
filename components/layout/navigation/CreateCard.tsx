import { Button, useBreakpointValue } from '@chakra-ui/react';
import router, { useRouter } from 'next/router';
import React from 'react'
const CreateCard = function () {
	const router = useRouter();
	const mobileOrDesktopSize = useBreakpointValue({ base: "xs", sm: "sm" })

	// ...code
	return <Button size={mobileOrDesktopSize}
		bgColor="teal.700" color={"white"}
		_hover={{ bg: "white", color: "teal.700" }}
		onClick={() => router.push("/editor/new")}>Create Card</Button>
}

export default CreateCard;