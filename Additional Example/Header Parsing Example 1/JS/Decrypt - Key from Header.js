// String Decryption with AES 128 UTF8
const fs = require('fs');
const path = require('path');
var CryptoJS = require("crypto-js");
const { program } = require('commander');

program
  .option('-d, --data <file_path>', 'Path to file containing encrypted data');

program.parse(process.argv);
const options = program.opts();

const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);
var data = fs.readFileSync(absoluteFilePath, 'utf8');
const bodyEndMarker = '\n--BODY_END--\n';
const [ciphertext, headersRaw] = data.split(bodyEndMarker);

// Call the function to handle decryption
const originalText = Decryption(ciphertext.trim(), headersRaw);

// Write to same temp file in same format body\n--BODY_END--\nheader
var output = originalText + "\n--BODY_END--\n" + headersRaw;
fs.writeFileSync(absoluteFilePath, output);

// We have Key IV in Header for each request
// We don't need to edit the header, we can just read it and parse it to get key/iv
// We can update the header if we want, but have to edit the code to do that and return updated header
function Decryption(ciphertext, header) {
  const headersplit = header.split(/\r?\n/);
  // Extract specific header values
  const keyLine = headersplit.find(line => line.startsWith('Key:'));
  const ivLine = headersplit.find(line => line.startsWith('Iv:'));

  const key = keyLine.replace('Key:', '').trim();
  const iv = ivLine.replace('Iv:', '').trim();

  var bytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
    keySize: 128 / 8,
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  });

  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}