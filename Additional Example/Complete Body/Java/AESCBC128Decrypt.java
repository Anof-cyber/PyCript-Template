import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.json.JSONObject;

public class AESCBC128Decrypt {

    public static String aesCbcDecrypt(String ciphertext, String key, String iv) throws Exception {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        byte[] ivBytes = iv.getBytes(StandardCharsets.UTF_8);

        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(ciphertext));
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    public static void main(String[] args) {
        if (args.length != 2 || !args[0].equals("-d")) {
            System.out.println("Usage: java AESCBC128Decrypt -d <base64-data>");
            return;
        }

        String ciphertextfilepath = args[1];
        String base64Data = null;
        try (FileReader reader = new FileReader(ciphertextfilepath)) {
            JSONObject jsonObject = new JSONObject(reader);
            base64Data = (String) jsonObject.get("data");

        } catch (IOException  e) {
            System.err.println("Error reading JSON file: " + e.getMessage());
        };

        try {
            // Decode the Base64 data
            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
            String jsonData = new String(decodedBytes, StandardCharsets.UTF_8);

            // Extract key and IV from the JSON
            JSONObject jsonObject = new JSONObject(jsonData);
            String ciphertext = jsonObject.getString("user_id");
            String key = jsonObject.getString("key");
            String iv = jsonObject.getString("iv");

            // Decrypt the data
            String decryptedData = aesCbcDecrypt(ciphertext, key, iv);

            // Create a JSON output with decrypted data
            JSONObject outputJson = new JSONObject();
            outputJson.put("user_id", decryptedData);
            outputJson.put("key", key);
            outputJson.put("iv", iv);

            // Print the JSON output
            System.out.println(outputJson.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
