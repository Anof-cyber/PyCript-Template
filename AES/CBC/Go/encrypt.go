package main

import (
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"bytes"

	"crypto/aes"
	"crypto/cipher"
)

func main() {
	// Define command-line flags
	filePath := flag.String("d", "", "Path to JSON file containing base64 data")
	flag.Parse()

	if *filePath == "" {
		return
	}
	jsonData, err := ioutil.ReadFile(*filePath)
	if err != nil {
		return
	}

	var data map[string]string
	if err := json.Unmarshal(jsonData, &data); err != nil {
		fmt.Println("Error parsing JSON:", err)
		return
	}

	base64Data := data["data"]

	decodedData, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return
	}

	key := []byte("mysecretkey12345")
	iv := []byte("n2r5u8x/A%D*G-Ka")

	decodedData = padPKCS7(decodedData, aes.BlockSize)

	encryptedData, err := encryptAES(decodedData, key, iv)
	if err != nil {
		return
	}

	encryptedBase64 := base64.StdEncoding.EncodeToString(encryptedData)
	fmt.Println(encryptedBase64)
}

func encryptAES(data, key, iv []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	ciphertext := make([]byte, len(data))
	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(ciphertext, data)

	return ciphertext, nil
}



func padPKCS7(data []byte, blockSize int) []byte {
	padding := blockSize - len(data)%blockSize
	padText := byte(padding)
	return append(data, bytes.Repeat([]byte{padText}, padding)...)
}
