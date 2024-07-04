param(
    [string]$d
)

if (-not $d) {
    exit 1
}

try {
    $jsonContent = Get-Content $d -Raw | ConvertFrom-Json
    $base64Data = $jsonContent.data
    $firstDecodedBytes = [Convert]::FromBase64String($base64Data)
    $firstDecodedString = [System.Text.Encoding]::UTF8.GetString($firstDecodedBytes)
} catch {
    exit 1
}

$key = "mysecretkey12345"
$iv = "n2r5u8x/A%D*G-Ka"

$plaintextBytes = [System.Text.Encoding]::UTF8.GetBytes($firstDecodedString)

$aes = [System.Security.Cryptography.Aes]::Create()
$aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
$aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7
$aes.Key = [System.Text.Encoding]::UTF8.GetBytes($key)
$aes.IV = [System.Text.Encoding]::UTF8.GetBytes($iv)
$encryptor = $aes.CreateEncryptor($aes.Key, $aes.IV)

$encryptedBytes = $encryptor.TransformFinalBlock($plaintextBytes, 0, $plaintextBytes.Length)
$encryptor.Dispose()

$encryptedBase64 = [Convert]::ToBase64String($encryptedBytes)

$doubleEncodedBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($encryptedBase64))

Write-Output $encryptedBase64