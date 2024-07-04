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
var data = fs.readFileSync(absoluteFilePath).toString();
const jsonData = JSON.parse(data);
const base64Data = jsonData.data; 
const requestbody = Buffer.from(base64Data, 'base64').toString('utf8');

let crypt = new JSEncrypt();
let PASS_PUB_KEY = '<<<public key>>'
crypt.setPublicKey(PASS_PUB_KEY);
let encrypted_data = crypt.encrypt(requestbody);
console.log(encodeURIComponent(encrypted_data))