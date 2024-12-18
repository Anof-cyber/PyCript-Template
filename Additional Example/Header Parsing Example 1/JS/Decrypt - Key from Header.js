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
const originalText = Decryption(ciphertext,headersRaw);

// convert the updated string to byte array again
const updated_output_byte = Array.from(originalText).map(char => char.charCodeAt(0));
var output = updated_output_byte +"\n--BODY_END--\n"+headersRaw
// write to same temp file in same formamt body\n--BODY_END--\nheader
fs.writeFileSync(absoluteFilePath,output)





// We have Key IV in Header for each request, We don't need to edit the header we can just read it parse it to get key iv, we can update the header if we want have to edit the code to do that and return updated header
function Decryption(ciphertext,header) {
  const headersplit = header.split(/\r?\n/);
  // Extract specific header values
  const key = headersplit.find(line => line.startsWith('Key:'));
  const iv = headersplit.find(line => line.startsWith('Iv:'));
    
  var bytes  = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key),
  {	
    keySize: 128 / 8,
    iv:  CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC
  });
  
  
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  }








