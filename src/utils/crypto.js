/**
 * Cryptographic Utilities using Web Crypto API
 * Safe, browser-native SHA-256 hashing with salt support.
 * 
 * NOTE: In production enterprise applications, authentication and password hashing 
 * must be performed securely on the backend server.
 */

/**
 * Generate a random cryptographic hex salt
 */
export function generateSalt(length = 16) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate SHA-256 hex hash of any string
 * @param {string} message 
 * @returns {Promise<string>} Hex representation of SHA-256 hash
 */
export async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Hash password with per-user salt
 * @param {string} password 
 * @param {string} salt 
 * @returns {Promise<string>}
 */
export async function hashPasswordWithSalt(password, salt) {
  return await sha256(`${salt}:${password}`);
}
