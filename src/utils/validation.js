export const isValidUsername = (username) => /^[a-zA-Z0-9]+$/.test(username);

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password) => {
  // Minimum 8 chars, at least one uppercase, one lowercase, one number, one symbol
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
};
