import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  if (key.length < 32) {
    throw new Error("ENCRYPTION_KEY must be at least 32 characters");
  }
  // Use scrypt to derive a proper 32-byte key
  const salt = Buffer.from("hillway-alpha-static-salt", "utf8");
  return scryptSync(key, salt, 32);
}

/**
 * Encrypts a string value using AES-256-GCM
 * Returns a base64-encoded string containing: iv:authTag:encryptedData
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  // Combine iv + authTag + encrypted data
  const combined = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, "base64"),
  ]);

  return combined.toString("base64");
}

/**
 * Decrypts a string that was encrypted with encrypt()
 */
export function decrypt(encryptedData: string): string {
  const key = getKey();
  const combined = Buffer.from(encryptedData, "base64");

  // Extract iv, authTag, and encrypted content
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}

/**
 * Safely encrypt a value, returning null if the input is null/undefined
 */
export function encryptIfPresent(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  return encrypt(value);
}

/**
 * Safely decrypt a value, returning null if the input is null/undefined
 */
export function decryptIfPresent(
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  try {
    return decrypt(value);
  } catch (error) {
    console.error("Failed to decrypt value:", error);
    return null;
  }
}
