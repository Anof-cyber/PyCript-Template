// String Decryption with AES 128 UTF8
//KtKB81Oamvuzo9entPFKZQ==
var CryptoJS = require("crypto-js");
const program = require("commander");
const { Buffer } = require('buffer');
program
  .option("-d, --data <data>", "Data to process")
  .parse(process.argv);
  
  
const options = program.opts();
  
var key = "1234"
var ciphertext = Buffer.from(options.data, 'base64').toString('utf8');
var bytes  = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key),
{	
	keySize: 128 / 8,
  mode: CryptoJS.mode.ECB
});
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText)

