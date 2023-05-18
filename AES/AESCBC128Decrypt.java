import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

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

    public static void main(String[] args) {
        if (args.length != 2 || !args[0].equals("-d")) {
            System.out.println("Usage: java AESCBCDecrypt -d <your-base64-ciphertext>");
            return;
        }

        String base64Ciphertext = args[1];
        String key = "mysecretkey12345";
        String iv = "n2r5u8x/A%D*G-Ka";

        try {
            String ciphertext = new String(Base64.getDecoder().decode(base64Ciphertext), StandardCharsets.UTF_8);
            String decryptedData = aesCbcDecrypt(ciphertext, key, iv);
            System.out.println(decryptedData);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
