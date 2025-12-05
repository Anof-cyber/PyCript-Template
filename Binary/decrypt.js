// String Decryption with AES 128 UTF8
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const crypto = require('crypto');

program
  .option('-d, --data <file_path>', 'Path to file containing encrypted data');

program.parse(process.argv);
const options = program.opts();

const filePath = options.data;
const absoluteFilePath = path.resolve(filePath);

// Read as binary buffer first to check if it contains the marker
var dataBuffer = fs.readFileSync(absoluteFilePath);
var dataString = dataBuffer.toString('utf8');
const bodyEndMarker = '\n--BODY_END--\n';

let ciphertextBuffer;
let headersRaw = '';

if (dataString.includes(bodyEndMarker)) {
  // File contains marker, split it
  const markerIndex = dataBuffer.indexOf(bodyEndMarker);
  ciphertextBuffer = dataBuffer.slice(0, markerIndex);
  headersRaw = dataBuffer.slice(markerIndex + bodyEndMarker.length).toString('utf8');
} else {
  // No marker, entire file is ciphertext
  ciphertextBuffer = dataBuffer;
}

// Call the functions to handle decryption and headers
const originalText = Decryption(ciphertextBuffer);
const updatedHeader = Read_parse_Header(headersRaw);

// Write to same temp file in same format body\n--BODY_END--\nheader
var output = originalText + "\n--BODY_END--\n" + updatedHeader;
fs.writeFileSync(absoluteFilePath, output);

function Decryption(ciphertext) {
  const key = Buffer.from('mysecretkey12345');  // 128-bit key (16 bytes)
  const iv = Buffer.from('n2r5u8x/A%D*G-Ka');   // 128-bit IV (16 bytes)

  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.setAutoPadding(true);  // Ensure padding is handled properly

    // Decrypt the data - ciphertext is already a Buffer of raw binary data
    let decryptedData = decipher.update(ciphertext);

    // Handle the final block and concatenate
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    // Convert the decrypted data to a string
    const decodedString = decryptedData.toString('utf8');

    return decodedString;
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Decryption failed: ' + err.message);
  }
}

function Read_parse_Header(headersRaw) {
  // Logic to read/edit header
  return headersRaw;
}