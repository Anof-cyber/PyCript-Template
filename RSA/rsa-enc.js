const JSEncrypt = require('nodejs-jsencrypt').default;
const program = require("commander");
const { Buffer } = require('buffer');
const fs = require('fs');
const path = require('path');

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


const publicKey  = "-----BEGIN PUBLIC KEY-----\n<>-----END PUBLIC-----\n"; 
// call the functions to handle decrpytion, headers 
const originalText = encryptData(plaintext,publicKey);

const updatedHeader = Read_parse_Header(headersRaw);

// convert the updated string to byte array again
const updated_output_byte = Array.from(originalText).map(char => char.charCodeAt(0));
var output = updated_output_byte +"\n--BODY_END--\n"+updatedHeader
// write to same temp file in same formamt body\n--BODY_END--\nheader
fs.writeFileSync(absoluteFilePath,output)



function encryptData(data, publicKey) {
  let crypt = new JSEncrypt();
  crypt.setPublicKey(publicKey);
  return crypt.encrypt(data);
}

function Read_parse_Header(headersRaw) {

  // logic to read/edit header
  
  return headersRaw;
  
  }