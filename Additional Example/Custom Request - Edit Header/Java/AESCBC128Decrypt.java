import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.security.MessageDigest;
import org.json.JSONObject;

public class AESCBC128Decrypt {

    public static String aesCbcDecrypt(String ciphertext, String key, String iv) throws Exception {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        byte[] ivBytes = iv.getBytes(StandardCharsets.UTF_8);
        byte[] cipherBytes = Base64.getDecoder().decode(ciphertext);

        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] decryptedBytes = cipher.doFinal(cipherBytes);
        String plaintext = new String(decryptedBytes, StandardCharsets.UTF_8);

        return plaintext;
    }









    public static String calculateMD5(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        if (args.length != 4 || !args[0].equals("-d") || !args[2].equals("-h")) {
            System.out.println("Usage: java AESCBC128Encrypt -d <base64-data> -h <base64-header>");
            return;
        }

        String base64Data = args[1];
        String base64Header = args[3];

        try {
            // Decode the Base64 data
            byte[] decodedData = Base64.getDecoder().decode(base64Data);
            String jsonData = new String(decodedData, StandardCharsets.UTF_8);

            // Parse the JSON data
            JSONObject jsonObject = new JSONObject(jsonData);

            // Get the value of the "user_id" field
            //String userId = jsonObject.getString("user_id");


            String userId;
            Object userIdObj = jsonObject.get("user_id");
            if (userIdObj instanceof String) {
                userId = (String) userIdObj;
            } else {
                userId = String.valueOf(userIdObj);
            }



            // Encrypt the user ID
            String key = "mysecretkey12345";
            String iv = "n2r5u8x/A%D*G-Ka";

            String decryptedid = aesCbcDecrypt(userId, key, iv);

            // Update the JSON data with the encrypted user ID
            jsonObject.put("user_id", decryptedid);

            // Decode the Base64 header
            byte[] decodedHeader = Base64.getDecoder().decode(base64Header);
            String rawHeader = new String(decodedHeader, StandardCharsets.UTF_8);

            // Split the header into lines
            String[] lines = rawHeader.split("\\r?\\n");
            String updatedJsonData = jsonObject.toString();

            // Find the Signature header and update its value
            for (int i = 0; i < lines.length; i++) {
                if (lines[i].startsWith("Signature:")) {
                    String oldSignature = lines[i].substring("Signature:".length()).trim();
                    String newSignature = calculateMD5(updatedJsonData);
                    lines[i] = "Signature: " + newSignature;
                    break;
                }
            }

            // Join the header lines back together
            String updatedHeader = String.join("\r\n", lines);

            String updatedHeaderBase64Body = Base64.getEncoder().encodeToString(updatedHeader.getBytes(StandardCharsets.UTF_8));

            // Print the updated header
            

            // Print the updated body (JSON) as Base64
            String updatedBody = jsonObject.toString();
            String updatedBase64Body = Base64.getEncoder().encodeToString(updatedBody.getBytes(StandardCharsets.UTF_8));
            System.out.println(updatedHeaderBase64Body);
            System.out.println(updatedBase64Body);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
