param(
    [string]$d
)

if (-not $d) {
    exit 1
}

try {
    $jsonContent = Get-Content $d -Raw | ConvertFrom-Json
    $base64Data = $jsonContent.data
    
} catch {
    exit 1
}

try {
    $firstDecodedBytes = [Convert]::FromBase64String($base64Data)
    $firstDecodedString = [System.Text.Encoding]::UTF8.GetString($firstDecodedBytes)
    
} catch {
    exit 1
}

try {
    $dataBytes = [Convert]::FromBase64String($firstDecodedString)
    
} catch {
    exit 1
}

if ($dataBytes.Length % 16 -ne 0) {
    exit 1
}

$key = "mysecretkey12345"
$iv = "n2r5u8x/A%D*G-Ka"

$aes = [System.Security.Cryptography.Aes]::Create()
$aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
$aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7
$aes.Key = [System.Text.Encoding]::UTF8.GetBytes($key)
$aes.IV = [System.Text.Encoding]::UTF8.GetBytes($iv)

try {
    $decryptor = $aes.CreateDecryptor($aes.Key, $aes.IV)
    $decryptedBytes = $decryptor.TransformFinalBlock($dataBytes, 0, $dataBytes.Length)
    $decryptor.Dispose()
} catch {
    exit 1
}

try {
    $decryptedText = [System.Text.Encoding]::UTF8.GetString($decryptedBytes)
    Write-Output $decryptedText
} catch {
    exit 1
}
