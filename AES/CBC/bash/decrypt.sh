#!/bin/bash

# Parse arguments
while getopts "d:" opt; do
  case $opt in
    d) FILE_PATH=$OPTARG ;;
    *) echo "Invalid option"; exit 1 ;;
  esac
done

if [ -z "$FILE_PATH" ]; then
  echo "File path argument (-d) is required."
  exit 1
fi

# Read JSON file and extract base64 encoded data
BASE64_DATA=$(jq -r '.data' "$FILE_PATH")
echo "Base64 Data: $BASE64_DATA"

# Decode the first layer of base64 added by PyCript 
ORIGINAL_ENCRYPTED=$(echo -n "$BASE64_DATA" | base64 --decode)
echo "First Decoded: $ORIGINAL_ENCRYPTED"



KEY="mysecretkey12345"
IV="n2r5u8x/A%D*G-Ka"

KEY_HEX=$(echo -n "$KEY" | xxd -p)
IV_HEX=$(echo -n "$IV" | xxd -p)

DECRYPTED=$(echo -n "$ORIGINAL_ENCRYPTED" | openssl enc -d -aes-128-cbc -K "$KEY_HEX" -iv "$IV_HEX" -base64 -A 2>/dev/null)

if [ $? -ne 0 ]; then
  exit 1
fi
echo $DECRYPTED
