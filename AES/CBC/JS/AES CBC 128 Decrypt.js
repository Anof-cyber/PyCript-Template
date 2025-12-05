// String Decryption with AES 128 UTF8
const fs = require('fs');
const path = require('path');
var CryptoJS = require("crypto-js");
const { program } = require('commander');

program
  .option('-d, --data <file_path>', 'Path to file containing encrypted data');
  
program.parse(process.argv);
const options = program.opts();
 
const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);

// Read the file as binary buffer (raw bytes)
var data = fs.readFileSync(absoluteFilePath);
const bodyEndMarker = Buffer.from('\n--BODY_END--\n', 'utf8');

// Find the marker position
const markerIndex = data.indexOf(bodyEndMarker);

let bodyBytes;
let headersRaw = '';

if (markerIndex !== -1) {
    // Extract body (before marker)
    bodyBytes = data.slice(0, markerIndex);
    
    // Extract headers (after marker)
    const headerStart = markerIndex + bodyEndMarker.length;
    if (headerStart < data.length) {
        const headerBytes = data.slice(headerStart);
        headersRaw = headerBytes.toString('utf8').trim();
    }
} else {
    // No marker found, treat entire content as body
    bodyBytes = data;
}

// Convert body bytes to string for decryption
const ciphertext = bodyBytes.toString('utf8');

// Call the functions to handle decryption, headers 
const originalText = Decryption(ciphertext);
const updatedHeader = Read_parse_Header(headersRaw);

// Convert the decrypted string back to bytes (Buffer)
const updatedBodyBytes = Buffer.from(originalText, 'utf8');

// Combine body + marker + headers
const output = Buffer.concat([
    updatedBodyBytes,
    bodyEndMarker,
    Buffer.from(updatedHeader, 'utf8')
]);

// Write to same temp file in same format: body\n--BODY_END--\nheader
fs.writeFileSync(absoluteFilePath, output);


function Decryption(ciphertext) {
    var key = "mysecretkey12345";
    var iv = "n2r5u8x/A%D*G-Ka";
    var bytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {	
        keySize: 128 / 8,
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC
    });
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

function Read_parse_Header(headersRaw) {
    // Logic to read/edit header
    return headersRaw;
}