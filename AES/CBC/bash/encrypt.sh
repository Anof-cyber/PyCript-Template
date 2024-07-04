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

BASE64_DATA=$(jq -r '.data' "$FILE_PATH")

ORIGINAL_DATA=$(echo -n "$BASE64_DATA" | base64 --decode)

KEY="mysecretkey12345"
IV="n2r5u8x/A%D*G-Ka"

KEY_HEX=$(echo -n "$KEY" | xxd -p)
IV_HEX=$(echo -n "$IV" | xxd -p)

ENCRYPTED=$(echo -n "$ORIGINAL_DATA" | openssl enc -aes-128-cbc -K "$KEY_HEX" -iv "$IV_HEX" -base64 -A 2>/dev/null)

if [ $? -ne 0 ]; then
  echo "Encryption failed."
  exit 1
fi

echo $ENCRYPTED
