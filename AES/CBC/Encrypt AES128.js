// String Encryption with AES 128 UTF8
//{"userid":2}
var CryptoJS = require("crypto-js");
const program = require("commander");
const { Buffer } = require('buffer');
program
  .option("-d, --data <data>", "Data to process")
  .parse(process.argv);
  
  
const options = program.opts();
  
var key = "1234"
const plaintext = Buffer.from(options.data, 'base64').toString('utf8');
var iv = "1234"
var bytes  = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key),
{	
	keySize: 128 / 8,
	iv:  CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
});
var originalText = bytes.toString();

console.log(originalText)