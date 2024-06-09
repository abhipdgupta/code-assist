import CryptoJS from 'crypto-js';

const encryptionKey = 'your-encryption-key';
let decryptedApiKey:string | null = null;

export function loadApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['apiKey'], (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (result.apiKey) {
        decryptedApiKey = CryptoJS.AES.decrypt(result.apiKey, encryptionKey).toString(CryptoJS.enc.Utf8);
      }
      resolve(decryptedApiKey);
    });
  });
}

export function setApiKey(apiKey:string) {
    return new Promise((resolve, reject) => {
      if (!apiKey) {
        return reject('API key is required');
      }
      const encryptedKey = CryptoJS.AES.encrypt(apiKey, encryptionKey).toString();
      chrome.storage.local.set({ apiKey: encryptedKey }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        decryptedApiKey = apiKey;
        resolve(encryptedKey);
      });
    });
  }

export function getApiKey() {
  return decryptedApiKey;
}
