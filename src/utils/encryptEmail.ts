// utils/encryptEmail.ts
import CryptoJS from "crypto-js";

export const encryptEmail = (email: string): string => {
  const secret = import.meta.env.VITE_SECRET_KEY as string;
  return CryptoJS.AES.encrypt(email, secret).toString();
};

export const decryptEmail = (encrypted: string): string => {
  const secret = import.meta.env.VITE_SECRET_KEY as string;
  const bytes = CryptoJS.AES.decrypt(encrypted, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};
