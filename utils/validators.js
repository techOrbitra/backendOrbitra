export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidMobile = (mobile) => {
  const mobileRegex = /^\+?[0-9]{10,15}$/;
  return mobileRegex.test(mobile);
};
