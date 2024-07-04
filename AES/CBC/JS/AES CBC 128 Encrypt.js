// String Encryption with AES 128 UTF8
//{"userid":2}
const fs = require('fs');
const path = require('path');
var CryptoJS = require("crypto-js");
const { program } = require('commander');
const { Buffer } = require('buffer');

program
  .option('-d, --data <file_path>', 'Path to JSON file containing base64 encoded + encrypted data');
  
program.parse(process.argv);
const options = program.opts();
 
const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);
var data = fs.readFileSync(absoluteFilePath).toString();
const jsonData = JSON.parse(data);
const base64Data = jsonData.data; 
const plaintext = Buffer.from(base64Data, 'base64').toString('utf8');
  
var key = "mysecretkey12345"
var iv = "n2r5u8x/A%D*G-Ka"
var bytes  = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key),
{	
	keySize: 128 / 8,
	iv:  CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
});
var originalText = bytes.toString();

console.log(originalText)