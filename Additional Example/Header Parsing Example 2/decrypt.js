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
const ciphertext = buffer.toString('utf8') // convert it string 


// call the functions to handle decrpytion, headers 
const originalText = Decryption(ciphertext);
const updatedHeader = Read_parse_Header(headersRaw,originalText);

// convert the updated string to byte array again
const updated_output_byte = Array.from(originalText).map(char => char.charCodeAt(0));
var output = updated_output_byte +"\n--BODY_END--\n"+updatedHeader
// write to same temp file in same formamt body\n--BODY_END--\nheader
fs.writeFileSync(absoluteFilePath,output)




function Decryption(ciphertext) {
  var key = "mysecretkey12345"
  var iv = "n2r5u8x/A%D*G-Ka"
  var bytes  = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key),
  {	
    keySize: 128 / 8,
    iv:  CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC
  });
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
  }

function Read_parse_Header(header,updatedbody) {

// logic to read/edit header
var headersplit = header.split(/\r?\n/)

// go through json and update the signature header with updated body md5 hash
for (var i = 0; i < headersplit.length; i++) {
    if (headersplit[i].startsWith('Signature:')) {
        headersplit[i] = 'Signature: ' + CryptoJS.MD5(updatedbody).toString();
        break;
    }
}

// join the header to as original format
var updatedheader = headersplit.join("\r\n")
return updatedheader
}