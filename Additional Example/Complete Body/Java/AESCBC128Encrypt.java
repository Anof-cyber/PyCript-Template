import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.json.JSONObject;

public class AESCBC128Encrypt {

    public static String aesCbcEncrypt(String plaintext, String key, String iv) throws Exception {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        byte[] ivBytes = iv.getBytes(StandardCharsets.UTF_8);

        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] encryptedBytes = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public static void main(String[] args) {
        if (args.length != 2 || !args[0].equals("-d")) {
            System.out.println("Usage: java AESCBC128Encrypt -d <base64-data>");
            return;
        }

        String base64Data = args[1];

        try {
            // Decode the Base64 data
            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
            String jsonData = new String(decodedBytes, StandardCharsets.UTF_8);

            // Parse the JSON object
            JSONObject jsonObject = new JSONObject(jsonData);
            String plaintext = jsonObject.getString("user_id");
            String key = jsonObject.getString("key");
            String iv = jsonObject.getString("iv");

            // Encrypt the data
            String ciphertext = aesCbcEncrypt(plaintext, key, iv);

            // Create a JSON output with the encrypted data
            JSONObject outputJson = new JSONObject();
            outputJson.put("user_id", ciphertext);
            outputJson.put("key", key);
            outputJson.put("iv", iv);

            // Print the JSON output
            System.out.println(outputJson.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
