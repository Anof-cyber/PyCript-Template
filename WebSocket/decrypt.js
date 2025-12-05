const fs = require('fs');
const path = require('path');
var CryptoJS = require("crypto-js");
const { program } = require('commander');

program
  .option('-d, --data <file_path>', 'Path to file containing WebSocket message data');

program.parse(process.argv);
const options = program.opts();

const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);

var data = fs.readFileSync(absoluteFilePath, 'utf8');

const BODY_END_MARKER = '\n--BODY_END--\n';
const parts = data.split(BODY_END_MARKER);
const encryptedPayload = parts[0]; // Get data before marker

const decryptedMessage = decryptMessage(encryptedPayload);
console.log("Decrypted message:", decryptedMessage);

// Write decrypted data back WITH the marker
fs.writeFileSync(absoluteFilePath, decryptedMessage + BODY_END_MARKER);

function decryptMessage(encryptedMessage) {

  const SECRET_KEY = 'my_secret_key_123';
  let encrypted = encryptedMessage;
  try {
    const parsed = JSON.parse(encryptedMessage);
    if (parsed.encrypted) {
      encrypted = parsed.encrypted;
    }
  } catch (e) {
    // Not JSON, treat as raw string
  }
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  const decrypted_data = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted_data;
}