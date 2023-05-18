// String Decryption with AES 128 UTF8
//KtKB81Oamvuzo9entPFKZQ==
var CryptoJS = require("crypto-js");
const program = require("commander");
const { Buffer } = require('buffer');
program
  .option("-d, --data <data>", "Data to process")
  .parse(process.argv);
  
  
const options = program.opts();
  
var key = "mysecretkey12345"
var iv = "n2r5u8x/A%D*G-Ka"
var ciphertext = Buffer.from(options.data, 'base64').toString('utf8');

var bytes  = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key),
{	
	keySize: 128 / 8,
	iv:  CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
});
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText)

