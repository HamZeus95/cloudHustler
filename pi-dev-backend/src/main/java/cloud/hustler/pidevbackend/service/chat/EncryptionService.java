package cloud.hustler.pidevbackend.service.chat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EncryptionService {
    
    @Value("${app.encryption.secret:defaultSecretKey12345678901234567890}")
    private String encryptionKey;
    
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    
    /**
     * Encrypts a plaintext message
     * 
     * @param plaintext The message to encrypt
     * @return Base64 encoded encrypted message including IV
     */
    public String encrypt(String plaintext) {
        try {
            // Get the encryption key
            SecretKey key = new SecretKeySpec(encryptionKey.getBytes(StandardCharsets.UTF_8), "AES");
            
            // Generate a random initialization vector (IV)
            byte[] iv = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(iv);
            
            // Initialize cipher in encrypt mode
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, parameterSpec);
            
            // Encrypt the message
            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
            
            // Combine IV and ciphertext and encode as Base64
            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + ciphertext.length);
            byteBuffer.put(iv);
            byteBuffer.put(ciphertext);
            
            return Base64.getEncoder().encodeToString(byteBuffer.array());
            
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting message", e);
        }
    }
    
    /**
     * Decrypts an encrypted message
     * 
     * @param encryptedText Base64 encoded encrypted message including IV
     * @return The decrypted plaintext message
     */
    public String decrypt(String encryptedText) {
        try {
            // Get the encryption key
            SecretKey key = new SecretKeySpec(encryptionKey.getBytes(StandardCharsets.UTF_8), "AES");
            
            // Decode from Base64
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
            
            // Extract IV and ciphertext
            ByteBuffer byteBuffer = ByteBuffer.wrap(decodedBytes);
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);
            
            byte[] ciphertext = new byte[byteBuffer.remaining()];
            byteBuffer.get(ciphertext);
            
            // Initialize cipher in decrypt mode
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, parameterSpec);
            
            // Decrypt the message
            byte[] decryptedBytes = cipher.doFinal(ciphertext);
            
            return new String(decryptedBytes, StandardCharsets.UTF_8);
            
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting message", e);
        }
    }
}