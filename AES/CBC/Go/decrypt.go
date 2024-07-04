package main

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
)

func main() {
	filePath := flag.String("d", "", "Path to JSON file containing base64 data")
	flag.Parse()

	if *filePath == "" {
		fmt.Println("File path argument (-d) is required.")
		return
	}

	jsonData, err := ioutil.ReadFile(*filePath)
	if err != nil {
		fmt.Println("Error reading JSON file:", err)
		return
	}

	var data map[string]string
	if err := json.Unmarshal(jsonData, &data); err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	base64Data := data["data"]
	originalBase64, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		fmt.Println("Error decoding base64 data as string:", err)
		return
	}
	decodedData, err := base64.StdEncoding.DecodeString(string(originalBase64))
	if err != nil {
		fmt.Println("Error decoding original base64 data to bytes:", err)
		return
	}

	key := []byte("mysecretkey12345")
	iv := []byte("n2r5u8x/A%D*G-Ka")

	// Decrypt the data
	decryptedData, err := decryptAES(decodedData, key, iv)
	if err != nil {
		fmt.Println("Error decrypting data:", err)
		return
	}

	fmt.Println(string(decryptedData))
}

func decryptAES(data, key, iv []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	decrypter := cipher.NewCBCDecrypter(block, iv)
	decryptedData := make([]byte, len(data))
	decrypter.CryptBlocks(decryptedData, data)

	return pkcs7Unpad(decryptedData, aes.BlockSize)
}

func pkcs7Unpad(data []byte, blockSize int) ([]byte, error) {
	if blockSize <= 0 {
		return nil, fmt.Errorf("invalid block size")
	}
	if len(data) == 0 || len(data)%blockSize != 0 {
		return nil, fmt.Errorf("invalid padding")
	}
	padLength := int(data[len(data)-1])
	if padLength > blockSize || padLength == 0 {
		return nil, fmt.Errorf("invalid padding")
	}
	for i := len(data) - padLength; i < len(data); i++ {
		if data[i] != byte(padLength) {
			return nil, fmt.Errorf("invalid padding")
		}
	}
	return data[:len(data)-padLength], nil
}
