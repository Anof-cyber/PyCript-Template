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



var parsedata = JSON.parse(body)


// go through json and encrypt each json value
for (var key in parsedata) {
    // Check if the property exists in the object (not inherited)
    if (parsedata.hasOwnProperty(key)) {
        // Update the value of each property
        parsedata[key] = encrypt(parsedata[key]);
    }
}

// updated json body
var updatedbody = JSON.stringify(parsedata);


// encryption code
function encrypt(value) {
    var key = "mysecretkey12345"
    var iv = "n2r5u8x/A%D*G-Ka"
    var bytes = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(key), {
        keySize: 128 / 8,
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC
    });
    var originalText = bytes.toString();
    return originalText
}



// split the raw http request header 
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

// printt the updated base64 header and updated base64 body
console.log(Buffer.from(updatedheader).toString('base64'));
console.log(Buffer.from(updatedbody).toString('base64'));