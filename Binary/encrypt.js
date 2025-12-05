// String Encryption with AES 128 UTF8
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const crypto = require('crypto');

program
  .option('-d, --data <file_path>', 'Path to file containing plaintext data');

program.parse(process.argv);
const options = program.opts();

const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);

// Read as binary buffer first
var dataBuffer = fs.readFileSync(absoluteFilePath);
var dataString = dataBuffer.toString('utf8');
const bodyEndMarker = '\n--BODY_END--\n';

let plaintext;
let headersRaw = '';

if (dataString.includes(bodyEndMarker)) {
  // File contains marker, split it
  const parts = dataString.split(bodyEndMarker);
  plaintext = parts[0];
  headersRaw = parts.slice(1).join(bodyEndMarker); // In case marker appears in headers
} else {
  // No marker, entire file is plaintext
  plaintext = dataString;
}

// Call the functions to handle encryption and headers
const encryptedData = Encryption(plaintext.trim());

// Write raw binary data + marker + header as bytes
const markerBuffer = Buffer.from(bodyEndMarker, 'utf8');
const headerBuffer = Buffer.from(headersRaw, 'utf8');
const output = Buffer.concat([encryptedData, markerBuffer, headerBuffer]);

// Write to same temp file with binary data
fs.writeFileSync(absoluteFilePath, output);

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