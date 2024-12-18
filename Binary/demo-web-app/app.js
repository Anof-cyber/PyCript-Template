const crypto = require('crypto');
const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Decrypt function
function decryptData(encryptedData) {
    const key = Buffer.from('mysecretkey12345');  // 128-bit key (16 bytes)
    const iv = Buffer.from('n2r5u8x/A%D*G-Ka');   // 128-bit IV (16 bytes)

    // encryptedData is received as raw binary data (Buffer)
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decryptedData = decipher.update(encryptedData, null, 'utf8');
    decryptedData += decipher.final('utf8');

    return JSON.parse(decryptedData);  // Return the original JSON data
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Example: Assuming the encrypted data is in the request body
app.use(express.raw({ type: 'application/octet-stream' }));  // Parse raw binary data

app.post('/decrypt', (req, res) => {
    const encryptedData = req.body;  // This is a Buffer containing raw binary data
    console.log(req.body)
    try {
        const decryptedData = decryptData(encryptedData);
        res.json(decryptedData);  // Send back the decrypted data
    } catch (err) {
        res.status(400).send('Decryption failed');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
