export const generateVerificationCode = (length = 6): string => {
  let verificationCode = '';
  const digits = '0123456789';
  const digitsLength = digits.length;

  for (let i = 0; i < length; i++) {
    verificationCode += digits.charAt(Math.floor(Math.random() * digitsLength));
  }

  return verificationCode;
};
