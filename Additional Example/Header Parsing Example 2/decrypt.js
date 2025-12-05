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

// Call the functions to handle decryption and headers
const originalText = Decryption(ciphertext.trim());
const updatedHeader = Read_parse_Header(headersRaw, originalText);

// Write to same temp file in same format body\n--BODY_END--\nheader
var output = originalText + "\n--BODY_END--\n" + updatedHeader;
fs.writeFileSync(absoluteFilePath, output);

function Decryption(ciphertext) {
  var key = "mysecretkey12345";
  var iv = "n2r5u8x/A%D*G-Ka";
  var bytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
    keySize: 128 / 8,
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  });
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

function Read_parse_Header(header, updatedbody) {
  // Logic to read/edit header
  var headersplit = header.split(/\r?\n/);

  // Go through headers and update the signature header with updated body md5 hash
  for (var i = 0; i < headersplit.length; i++) {
    if (headersplit[i].startsWith('Signature:')) {
      headersplit[i] = 'Signature: ' + CryptoJS.MD5(updatedbody).toString();
      break;
    }
  }

  // Join the header to original format
  var updatedheader = headersplit.join("\r\n");
  return updatedheader;
}