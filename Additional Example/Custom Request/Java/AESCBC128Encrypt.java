import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

public class AESCBC128Encrypt {

    public static void main(String[] args) throws Exception {
        String base64Ciphertext = null;
        String key = null;
        String iv = null;

        // parse command line arguments
        for (int i = 0; i < args.length; i++) {
            if ("-d".equals(args[i])) {
                base64Ciphertext = args[i + 1];
            }
            if ("-h".equals(args[i])) {
                String headerStr = args[i + 1];
                byte[] decodedBytes = Base64.getDecoder().decode(headerStr); // Decode base64
                String decodedHeaderStr = new String(decodedBytes);
                String[] headerArr = decodedHeaderStr.substring(1, decodedHeaderStr.length() - 1).split(", ");
                for (String header : headerArr) {
                    String[] keyValue = header.split(": ");
                    if ("Key".equals(keyValue[0])) {
                        key = keyValue[1];
                    } else if ("Iv".equals(keyValue[0])) {
                        iv = keyValue[1];
                    }
                }
            }
        }

        if (base64Ciphertext != null && key != null && iv != null) {
            // decode base64 ciphertext
            String ciphertext = new String(Base64.getDecoder().decode(base64Ciphertext), StandardCharsets.UTF_8);

            // decrypt the data
            String encryptedData = aesCbcEncrypt(ciphertext, key, iv);

            System.out.println(encryptedData);
        } else {
            System.out.println("Invalid command line arguments. Please provide -d <base64Ciphertext> and -h <header>.");
        }
    }

    public static String aesCbcEncrypt(String plaintext, String key, String iv) throws Exception {
        byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
        byte[] ivBytes = iv.getBytes(StandardCharsets.UTF_8);

        SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
        IvParameterSpec ivParameterSpec = new IvParameterSpec(ivBytes);

        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);

        byte[] encryptedBytes = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
        String ciphertext = Base64.getEncoder().encodeToString(encryptedBytes);

        return ciphertext;
    }




}
