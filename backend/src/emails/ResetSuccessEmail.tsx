import {
	Html,
	Head,
	Preview,
	Heading,
	Section,
	Row,
	Text,
  } from "@react-email/components";
  
  export default function ResetSuccessEmail() {
	return (
	  <Html lang="en">
		<Head>
		  <title>Password Reset Successful</title>
		</Head>
  
		<Preview>Your password was reset successfully</Preview>
  
		<Section style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
		  <Row>
			<Heading as="h2">Password Reset Successful 🎉</Heading>
		  </Row>
  
		  <Row>
			<Text>
			  Hello, your password has been successfully updated. Now you can login with your new password. If you did not
			  perform this action, please contact our support immediately.
			</Text>
		  </Row>
  
		  <Row>
			<Text>Thank you for using FsdFoods 🍔!</Text>
		  </Row>
		</Section>
	  </Html>
	);
  }
  