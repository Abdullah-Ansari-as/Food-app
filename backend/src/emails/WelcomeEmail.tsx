import {
	Html,
	Head,
	Font,
	Preview,
	Heading,
	Row,
	Section,
	Text,
  } from '@react-email/components';
  
  interface WelcomeEmailProps {
	username: string;
  }
  
  export default function WelcomeEmail({ username }: WelcomeEmailProps) { 
	return (
	  <Html lang="en" dir="ltr">
		<Head>
		  <title>Welcome to FsdFoods</title>
		  <Font
			fontFamily="Roboto"
			fallbackFontFamily="Verdana"
			webFont={{
			  url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
			  format: 'woff2',
			}}
			fontWeight={400}
			fontStyle="normal"
		  />
		</Head>
  
		<Preview>Welcome to FsdFoods, {username}!</Preview>
  
		<Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
		  <Row>
			<Heading as="h2">Hi {username},</Heading>
		  </Row>
  
		  <Row>
			<Text>
			  Welcome aboard! 🎉 We're thrilled to have you join our community. You can now explore our Restaurants, get started, and enjoy your Food.
			</Text>
		  </Row>
  
		  <Row>
			<Text>If you have any questions or need help, we're always here for you.</Text>
		  </Row>
  
		  <Row>
			<Text>FsdFoods,<br />The Team</Text>
		  </Row>
		</Section>
	  </Html>
	);
  }
  