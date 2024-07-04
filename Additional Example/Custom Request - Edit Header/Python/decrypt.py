import argparse
from base64 import b64decode,b64encode
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from cryptography.hazmat.backends import default_backend
import json
import hashlib

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


def update_signature(decoded_header,updatedbody):

    headersplit = decoded_header.split("\n")
    md5_hash = hashlib.md5(updatedbody.encode('utf-8')).hexdigest()

    for i in range(len(headersplit)):
        if headersplit[i].startswith('Signature:'):
            
            headersplit[i] = f'Signature: {md5_hash}'
            break
    updated_header = "\n".join(headersplit)
    return updated_header



with open(args.data, 'r') as file:    
    content_body = json.load(file).get("data")
    content_header = json.load(file).get("header")
        
jsondata = b64decode(content_body).decode('utf-8')
decoded_header = b64decode(content_header).decode('utf-8')


data = json.loads(jsondata)
ciphertext = data['user_id']
key = "mysecretkey12345"
iv = "n2r5u8x/A%D*G-Ka"
encrrypted = aes_cbc_decrypt(ciphertext, key, iv)
data['user_id'] = encrrypted
updatedbody = json.dumps(data)




updated_header = update_signature(decoded_header,updatedbody)


# Print the updated header
print(b64encode(updated_header.encode('utf-8')).decode('utf-8'))
print(b64encode(updatedbody.encode('utf-8')).decode('utf-8'))