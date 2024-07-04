import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import org.json.JSONObject;

public class AESCBC128Decrypt {

  public static void main(String[] args) throws Exception {
    String base64Ciphertext = null;
    String key = null;
    String iv = null;
    String headerStr = null;

    if (args.length != 2 || !args[0].equals("-d")) {
      System.out.println("Usage: java AESCBC128Decrypt -d <base64-data>");
      return;
    }

    String ciphertextfilepath = args[1];
    try (FileReader reader = new FileReader(ciphertextfilepath)) {
      JSONObject jsonObject = new JSONObject(reader);
      base64Ciphertext = (String) jsonObject.get("data");
      headerStr = (String) jsonObject.get("header");

    } catch (IOException e) {
      System.err.println("Error reading JSON file: " + e.getMessage());
    };

    byte[] decodedBytes = Base64.getDecoder().decode(headerStr); // Decode base64
    String decodedHeaderStr = new String(decodedBytes);
    String[] headerArr = decodedHeaderStr.substring(1, decodedHeaderStr.length() - 1).split(", ");
    for (String header: headerArr) {
      String[] keyValue = header.split(": ");
      if ("Key".equals(keyValue[0])) {
        key = keyValue[1];
      } else if ("Iv".equals(keyValue[0])) {
        iv = keyValue[1];
      }
    }

    if (base64Ciphertext != null && key != null && iv != null) {
      // decode base64 ciphertext
      String ciphertext = new String(Base64.getDecoder().decode(base64Ciphertext), StandardCharsets.UTF_8);

      // decrypt the data
      String decryptedData = aesCbcDecrypt(ciphertext, key, iv);

      System.out.println(decryptedData);
    } else {
      System.out.println("Invalid command line arguments. Please provide -d file_path.");
    }
  }

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

}