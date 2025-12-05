// String Encryption with AES 128 UTF8
const fs = require('fs');
const path = require('path');
var CryptoJS = require("crypto-js");
const { program } = require('commander');

program
  .option('-d, --data <file_path>', 'Path to file containing plaintext data');

program.parse(process.argv);
const options = program.opts();

const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);
var data = fs.readFileSync(absoluteFilePath, 'utf8');
const bodyEndMarker = '\n--BODY_END--\n';
const [plaintext, headersRaw] = data.split(bodyEndMarker);

// Call the function to handle encryption
const encryptedText = Encryption(plaintext.trim(), headersRaw);

// Write to same temp file in same format body\n--BODY_END--\nheader
var output = encryptedText + "\n--BODY_END--\n" + headersRaw;
fs.writeFileSync(absoluteFilePath, output);

function Encryption(plaintext, header) {
  const headersplit = header.split(/\r?\n/);
  // Extract specific header values
  const keyLine = headersplit.find(line => line.startsWith('Key:'));
  const ivLine = headersplit.find(line => line.startsWith('Iv:'));

  const key = keyLine.replace('Key:', '').trim();
  const iv = ivLine.replace('Iv:', '').trim();

  var encrypted = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {
    keySize: 128 / 8,
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  });

  var encryptedText = encrypted.toString();
  return encryptedText;
}