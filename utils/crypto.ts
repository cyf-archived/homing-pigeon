import CryptoJS from "crypto-js";
import { mapValues } from "lodash";

const ENCRYPT_SALT = process.env.ENCRYPT_SALT;
const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
const ENCRYPT_IV = process.env.ENCRYPT_IV;

const salt = CryptoJS.enc.Utf8.parse(ENCRYPT_SALT);
const pass = CryptoJS.enc.Utf8.parse(ENCRYPT_KEY);
const iv = CryptoJS.enc.Utf8.parse(ENCRYPT_IV);

const _encryptDefUrls = ["/api/backend/auth/login"];

const _encryptKeys = ["password", "newPassword", "oldPassword"];

const keySize = 256;
const iterations = 100;
export const encrypt = (text: string) => {
  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
    hasher: CryptoJS.algo.SHA256,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  return encrypted.toString();
};

export const decrypt = (encrypted: string): string => {
  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
    hasher: CryptoJS.algo.SHA256,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const encryptSensitiveInfo = (
  url: string,
  data: Record<string, any>,
) => {
  if (_encryptDefUrls.includes(url)) {
    return mapValues(data, (value, key) => {
      return _encryptKeys.includes(key) ? encrypt(value) : value;
    });
  }
  return data;
};
