// String Decryption with AES 128 UTF8
const fs = require('fs');
const path = require('path');
var CryptoJS = require("crypto-js");
const { program } = require('commander');
const { Buffer } = require('buffer');
const crypto = require('crypto');
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
const plaintext = Buffer.from(byteArray); // Convert byte array to Buffer
//const ciphertext = buffer.toString('utf8') // Since its raw data, contain non ascii, avoid using to string instead pass the buffer directly, depends on the enc/dec library

// call the functions to handle decrpytion, headers 
const originalText = Encryption(plaintext);
const updatedHeader = Read_parse_Header(headersRaw);

// convert the updated string to byte array again
const updated_output_byte = Array.from(originalText)   //.map(char => char.charCodeAt(0));   encrpyt provide buffer data, to get array we can directly call array not need ofr .map char to convert string to array 
var output = updated_output_byte +"\n--BODY_END--\n"+updatedHeader
// write to same temp file in same formamt body\n--BODY_END--\nheader
fs.writeFileSync(absoluteFilePath,output)




function Encryption(plaintext) {
    const key = Buffer.from('mysecretkey12345');  // 128-bit key (16 bytes)
    const iv = Buffer.from('n2r5u8x/A%D*G-Ka');   // 128-bit IV (16 bytes)
  
    try {
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        cipher.setAutoPadding(true);  // Ensure padding is handled properly
  
        // Encrypt the data
        let encryptedData = cipher.update(plaintext, 'utf8');  // Specify 'utf8' encoding for plaintext
  
        // Handle the final block and concatenate
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
  
        return encryptedData;  // Returning the encrypted data as Buffer
    } catch (err) {
        console.error('Encryption failed:', err);
        throw new Error('Encryption failed: ' + err.message);
    }
  }

function Read_parse_Header(headersRaw) {

// logic to read/edit header

return headersRaw;

}