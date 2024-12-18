// String Decryption with AES 128 UTF8
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
var data = fs.readFileSync(absoluteFilePath, 'utf8')
const bodyEndMarker = '\n--BODY_END--\n';
const [byteArrayStr, headersRaw] = data.split(bodyEndMarker);

const byteArray = JSON.parse(byteArrayStr.trim())
const buffer = Buffer.from(byteArray); // Convert byte array to Buffer
const plaintext = buffer.toString('utf8') // convert it string 


// call the functions to handle decrpytion, headers 
const originalText = Encryption(plaintext,headersRaw);
// convert the updated string to byte array again
const updated_output_byte = Array.from(originalText).map(char => char.charCodeAt(0));
var output = updated_output_byte +"\n--BODY_END--\n"+headersRaw
// write to same temp file in same formamt body\n--BODY_END--\nheader
fs.writeFileSync(absoluteFilePath,output)




function Encryption(plaintext,header) {

  const headersplit = header.split(/\r?\n/);
  // Extract specific header values
  const key = headersplit.find(line => line.startsWith('Key:'));
  const iv = headersplit.find(line => line.startsWith('Iv:'));
  
  var bytes  = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key),
  {	
    keySize: 128 / 8,
    iv:  CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC
  });
  var originalText = bytes.toString();
  return originalText;
  }


