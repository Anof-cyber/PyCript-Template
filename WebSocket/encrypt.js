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

// Split by --BODY_END-- marker to get only the WebSocket payload
const BODY_END_MARKER = '\n--BODY_END--\n';
const parts = data.split(BODY_END_MARKER);
const plainPayload = parts[0]; // Get data before marker

// Encrypt the WebSocket message
const encryptedMessage = encryptMessage(plainPayload);

// Write encrypted data back WITH the marker
fs.writeFileSync(absoluteFilePath, encryptedMessage + BODY_END_MARKER);

function encryptMessage(message) {
  const SECRET_KEY = 'my_secret_key_123';
  const encrypted = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  return encrypted;
}