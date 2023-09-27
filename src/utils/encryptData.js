import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = '1231231';
const encryptData = (props) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(props), ENCRYPTION_KEY).toString();
  return encryptedData;
};

export default encryptData;
