// String Encryption with AES 128 UTF8
const fs = require('fs');
const path = require('path');
var CryptoJS = require("crypto-js");
const { program } = require('commander');

program
  .option('-d, --data <file_path>', 'Path to file containing data');
  
program.parse(process.argv);
const options = program.opts();
 
const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);
var data = fs.readFileSync(absoluteFilePath, 'utf8');
const bodyEndMarker = '\n--BODY_END--\n';
const [bodyRaw, headersRaw] = data.split(bodyEndMarker);

// Body is already a string, no need for byte array conversion
const plaintext = bodyRaw;

// Call the functions to handle encryption, headers 
const encryptedText = Encryption(plaintext);
const updatedHeader = Read_parse_Header(headersRaw);

// Write to same temp file in same format body\n--BODY_END--\nheader
var output = encryptedText + "\n--BODY_END--\n" + updatedHeader;
fs.writeFileSync(absoluteFilePath, output, 'utf8');

function Encryption(plaintext) {
  var key = "mysecretkey12345";
  var iv = "n2r5u8x/A%D*G-Ka";
  var encrypted = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {	
    keySize: 128 / 8,
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
  });
  return encrypted.toString();
}

function Read_parse_Header(headersRaw) {
  // Logic to read/edit header
  return headersRaw;
}