import argparse
from base64 import b64decode
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from cryptography.hazmat.backends import default_backend
import json

# Create an argument parser
parser = argparse.ArgumentParser(description='Process data argument')
parser.add_argument('-d', '--data', help='File path with encrypted data + base64 in JSON format')

# Parse the arguments
args = parser.parse_args()


def aes_cbc_decrypt(ciphertext, key, iv):
    # Convert the key and IV to bytes
    key = key.encode('utf-8')
    iv = iv.encode('utf-8')

    # Base64 decode the ciphertext
    ciphertext = b64decode(ciphertext)

    # Create a Cipher object with AES CBC algorithm and PKCS7 padding
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    # Decrypt the ciphertext and remove the padding
    plaintext = decryptor.update(ciphertext) + decryptor.finalize()
    unpadder = PKCS7(algorithms.AES.block_size).unpadder()
    unpadded_plaintext = unpadder.update(plaintext) + unpadder.finalize()

    # Return the decrypted plaintext as a string
    return unpadded_plaintext.decode('utf-8')



with open(args.data, 'r') as file:    
    content_body = json.load(file).get("data")
    content_header = json.load(file).get("header")
        
ciphertext = b64decode(content_body).decode('utf-8')
header_data = b64decode(content_header).decode('utf-8')

pairs = header_data.split(',')

for pair in pairs:
    key_value = pair.strip().split(':')
    if len(key_value) == 2:
        key_entry = key_value[0].strip()
        value_entry = key_value[1].strip()
        if key_entry.lower() == 'key':
            key = value_entry
        elif key_entry.lower() == 'iv':
            iv = value_entry

decrypted_data = aes_cbc_decrypt(ciphertext, key, iv)
print(decrypted_data)

