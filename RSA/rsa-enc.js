const JSEncrypt = require('nodejs-jsencrypt').default;
const program = require("commander");
const fs = require('fs');
const path = require('path');

program
  .option('-d, --data <file_path>', 'Path to file containing plaintext data');

program.parse(process.argv);
const options = program.opts();

const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);
var data = fs.readFileSync(absoluteFilePath, 'utf8');
const bodyEndMarker = '\n--BODY_END--\n';
const [plaintext, headersRaw] = data.split(bodyEndMarker);

const publicKey = "-----BEGIN PUBLIC KEY-----\n<>-----END PUBLIC KEY-----\n";

// Call the functions to handle encryption and headers
const encryptedText = encryptData(plaintext.trim(), publicKey);
const updatedHeader = Read_parse_Header(headersRaw);

// Write to same temp file in same format body\n--BODY_END--\nheader
var output = encryptedText + "\n--BODY_END--\n" + updatedHeader;
fs.writeFileSync(absoluteFilePath, output);

function encryptData(data, publicKey) {
  let crypt = new JSEncrypt();
  crypt.setPublicKey(publicKey);
  return crypt.encrypt(data);
}

function Read_parse_Header(headersRaw) {
  // Logic to read/edit header
  return headersRaw;
}