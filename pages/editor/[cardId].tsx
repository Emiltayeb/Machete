import { useRouter } from 'next/router';
import React from 'react'

const UserCard = function () {

	const params = useRouter().query

	console.log(params)
	//  user want to load a specific card (like smart links)
	//  check if its in the store already
	// if not - fetch it

	return <div>
		{JSON.stringify(params)}
	</div>
}

export default UserCard;