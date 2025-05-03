// emails/ForgotPasswordEmail.tsx

import { Html, Head, Heading, Text, Link, Section } from '@react-email/components';

interface ForgotPasswordEmailProps {
  username: string;
  resetLink: string;
}

export default function ForgotPasswordEmail({ username, resetLink }: ForgotPasswordEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Reset Your Password (FsdFoods)</title>
      </Head>
      <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
        <Heading as="h2">Hi {username},</Heading>
        <Text>It looks like you requested to reset your password.</Text>
        <Text>
          Click the link below to reset your password:
        </Text>
        <Link href={resetLink} style={{ color: '#007bff' }}>
          Reset Password
        </Link>
        <Text>If you didn't request this, you can safely ignore this email.</Text>
      </Section>
    </Html>
  );
}
