/*
POST /crypto/myprofile/ HTTP/1.1
Host: localhost:8000
Accept-Encoding: gzip, deflate
Accept-Language: en-US;q=0.9,en;q=0.8
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36
Connection: close
Key: 1234
Iv: 1234
Cache-Control: max-age=0
Content-Type: application/x-www-form-urlencoded
Content-Length: 24

KtKB81Oamvuzo9entPFKZQ==

*/

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
var data = fs.readFileSync(absoluteFilePath).toString();
const jsonData = JSON.parse(data);
const body = Buffer.from(jsonData.data, 'base64').toString('utf8');
var header = Buffer.from(jsonData.header, 'base64').toString('utf8');


var headersplit = header.split(', ')
const key1 = headersplit.find(line => line.startsWith('Key:'));
const iv1 = headersplit.find(line => line.startsWith('Iv:'));
var key = key1.split(':')[1].split(" ")[1]
var iv = iv1.split(':')[1].split(" ")[1]

var bytes  = CryptoJS.AES.decrypt(body, CryptoJS.enc.Utf8.parse(key),
{	
	keySize: 128 / 8,
	iv:  CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
});


var originalText = bytes.toString(CryptoJS.enc.Utf8);
console.log(originalText); 


