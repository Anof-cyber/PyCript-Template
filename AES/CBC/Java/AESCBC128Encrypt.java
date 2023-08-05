import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class AESCBC128Encrypt {

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

    public static void main(String[] args) {
        if (args.length != 2 || !args[0].equals("-d")) {
            System.out.println("Usage: java AESCBCEncrypt -d <your-plaintext>");
            return;
        }

        String plaintext = args[1];
        String key = "mysecretkey12345";
        String iv = "n2r5u8x/A%D*G-Ka";

        try {
            String ciphertext = new String(Base64.getDecoder().decode(plaintext), StandardCharsets.UTF_8);
            String encryptedData = aesCbcEncrypt(ciphertext, key, iv);
            System.out.println(encryptedData);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
