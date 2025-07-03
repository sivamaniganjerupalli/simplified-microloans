// src/utils/validators.js

export function isValidAadhar(aadhar) {
  return /^\d{12}$/.test(aadhar);
}

export function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password) {
  return password.length >= 8;
}
