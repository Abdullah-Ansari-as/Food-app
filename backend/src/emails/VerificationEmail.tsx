
// emails/VerificationEmail.tsx

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
  
  interface VerificationEmailProps {
	username: string;
	otp: string;
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
	return (
	  <Html lang="en" dir="ltr">
		<Head>
		  <title>Email Verification</title>
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
  
		<Preview>Your verification code: {otp}</Preview>
  
		<Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
		  <Row>
			<Heading as="h2">Hello {username},</Heading>
		  </Row>
  
		  <Row>
			<Text>
			  Thank you for registering. Use the following verification code to complete your signup:
			</Text>
		  </Row>
  
		  <Row>
			<Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{otp}</Text>
		  </Row>
  
		  <Row>
			<Text>If you didn’t request this, feel free to ignore the email.</Text>
		  </Row>
		</Section>
	  </Html>
	);
  }
  