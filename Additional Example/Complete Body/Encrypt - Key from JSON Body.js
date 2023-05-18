// String encryption with AES 128 UTF8
//{"data":"{\"userid\":1}","key":"1234","iv":"12345"}
//encrypt json body with key and iv in the json object

var CryptoJS = require("crypto-js");
const program = require("commander");
const { Buffer } = require('buffer');

program
  .option("-d, --data <data>", "Data to process")
  .parse(process.argv);

const options = program.opts();

//Get Command Line Arguments value
var Requestbody = options.data

//Base64 decode and parse it for JSON
const decodedString = Buffer.from(Requestbody, 'base64').toString('utf8');
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
