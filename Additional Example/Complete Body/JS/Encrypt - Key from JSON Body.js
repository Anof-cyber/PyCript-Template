// String encryption with AES 128 UTF8
//{"data":"{\"userid\":1}","key":"1234","iv":"12345"}
//encrypt json body with key and iv in the json object

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
const base64Data = jsonData.data; 
const decodedString = Buffer.from(base64Data, 'base64').toString('utf8');
var parsedata = JSON.parse(decodedString)

//Fetch Key, IV and plain text from json object
var key = parsedata['key']
var iv = parsedata['iv']
var plaintext = parsedata['data']

//encrpyt the cipher text with the key and iv
var bytes  = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key),
{	
	keySize: 128 / 8,
	iv:  CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC
});

var originalText = bytes.toString();

//create the updated json object to disply in burp
var output = JSON.stringify({"data":originalText,"key":key,"iv":iv})

//print the output 
console.log(output)
