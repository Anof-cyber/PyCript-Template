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
const ciphertext = Buffer.from(byteArray); // Convert byte array to Buffer
//const ciphertext = buffer.toString('utf8') // Since its raw data, contain non ascii, avoid using to string instead pass the buffer directly, depends on the enc/dec library


// call the functions to handle decrpytion, headers 
const originalText = Decryption(ciphertext);
const updatedHeader = Read_parse_Header(headersRaw);

// convert the updated string to byte array again
const updated_output_byte = Array.from(originalText).map(char => char.charCodeAt(0));
var output = updated_output_byte +"\n--BODY_END--\n"+updatedHeader
// write to same temp file in same formamt body\n--BODY_END--\nheader
fs.writeFileSync(absoluteFilePath,output)




function Decryption(ciphertext) {
  const key = Buffer.from('mysecretkey12345');  // 128-bit key (16 bytes)
      const iv = Buffer.from('n2r5u8x/A%D*G-Ka');   // 128-bit IV (16 bytes)
  
      try {
          const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
          decipher.setAutoPadding(true);  // Ensure padding is handled properly
  
          // Decrypt the data
          let decryptedData = decipher.update(ciphertext);
  
          // Handle the final block and concatenate
          decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  
          // Convert the decrypted data to a string
          const decodedString = decryptedData.toString('utf8');
  
          return decodedString
      } catch (err) {
          console.error('Decryption failed:', err);
          throw new Error('Decryption failed: ' + err.message);
      }


  }

function Read_parse_Header(headersRaw) {

// logic to read/edit header

return headersRaw;

}