import argparse
from base64 import b64decode,b64encode
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from cryptography.hazmat.backends import default_backend


# Create an argument parser
parser = argparse.ArgumentParser(description='Process data argument')
parser.add_argument('-d', '--data', help='Input data')

# Parse the arguments
args = parser.parse_args()


def aes_cbc_encrypt(plaintext, key, iv):
    # Convert the key and IV to bytes
    key = key.encode('utf-8')
    iv = iv.encode('utf-8')

    # Create a Cipher object with AES CBC algorithm and PKCS7 padding
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Pad the plaintext using PKCS7
    padder = PKCS7(algorithms.AES.block_size).padder()
    padded_plaintext = padder.update(plaintext.encode('utf-8')) + padder.finalize()

    # Encrypt the padded plaintext
    ciphertext = encryptor.update(padded_plaintext) + encryptor.finalize()

    # Base64 encode the ciphertext
    encoded_ciphertext = b64encode(ciphertext).decode('utf-8')

    # Return the encoded ciphertext
    return encoded_ciphertext


ciphertext = b64decode(args.data).decode('utf-8')
key = "mysecretkey12345"
iv = "n2r5u8x/A%D*G-Ka"

decrypted_data = aes_cbc_encrypt(ciphertext, key, iv)
print(decrypted_data)