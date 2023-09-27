import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = '1231231';
const decryptData = (props) => {
  const bytes = CryptoJS.AES.decrypt(props.toString(), ENCRYPTION_KEY);
  const decryptedObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedObject;
};

export default decryptData;
