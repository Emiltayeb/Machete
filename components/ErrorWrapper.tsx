import { Button, Container, Heading } from '@chakra-ui/react';
import * as React from 'react';

type MyProps = {
	// using `interface` is also ok
	message?: string;
};
type MyState = {
	hasError: boolean; // like this
};


class ErrorBoundary extends React.Component<MyProps, MyState> {

	constructor(props: any) {
		super(props)

		// Define a state variable to track whether is an error or not
		this.state = { hasError: false }
	}
	static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI
		return { hasError: true }
	}
	componentDidCatch(error: any, errorInfo: any) {
		// You can use your own error logging service here
		console.log({ error, errorInfo })
	}
	render() {
		// Check if the error is thrown
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<Container maxW={"container.md"} p={5}>
					<Heading>Oops, there is an error!</Heading>
					<Button
						colorScheme={"linkedin"}
						type="button"
						onClick={() => {
							this.setState({ hasError: false })
							window.history.replaceState(null, "", "/")
						}}
					>
						Try again?
					</Button>
				</Container>
			)
		}

		// Return children components in case of no error

		return this.props.children
	}
}

export default ErrorBoundary