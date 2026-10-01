import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../firebase';
import { compressAndResizeImage } from '../utils/imageCompressor';

/**
 * Firebase Storage Service
 * Handles file uploads for product catalog images and user profile avatars.
 * Supports upload progress tracking and seamless local fallback when Firebase is not yet active.
 */
export const firebaseStorageService = {
  /**
   * Upload product image to Firebase Storage
   * @param {File|Blob} file 
   * @param {Function} [onProgress] - Optional callback(percent: number)
   * @returns {Promise<string>} Download URL or Base64 string
   */
  uploadProductImage: async (file, onProgress = () => {}) => {
    if (!file) throw new Error('No image file selected.');

    // Step 1: Pre-compress image on client to conserve storage bandwidth & ensure fast mobile load
    let compressedFile = file;
    try {
      if (file.type && file.type.startsWith('image/')) {
        const compressedBase64 = await compressAndResizeImage(file, {
          maxWidth: 900,
          maxHeight: 900,
          quality: 0.85,
          maxInputSizeMb: 5,
        });

        // Convert compressed Base64 to Blob for Firebase upload
        const response = await fetch(compressedBase64);
        compressedFile = await response.blob();
      }
    } catch (compressionErr) {
      console.warn('[firebaseStorageService] Client compression skipped, using original file:', compressionErr);
    }

    // Step 2: Upload to Firebase Storage if configured
    if (isFirebaseConfigured && storage) {
      return new Promise((resolve, reject) => {
        const cleanName = (file.name || 'product.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `products/${Date.now()}_${cleanName}`;
        const fileRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(fileRef, compressedFile, {
          contentType: file.type || 'image/jpeg',
          customMetadata: {
            uploadedFor: 'Aastha General Store Product Catalog',
          },
        });

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          },
          (error) => {
            console.error('[firebaseStorageService] Firebase upload failed:', error);
            reject(new Error(`Failed to upload to Firebase Storage: ${error.message}`));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              onProgress(100);
              resolve(downloadURL);
            } catch (urlErr) {
              reject(urlErr);
            }
          }
        );
      });
    }

    // Step 3: Local Fallback (simulate progress and return compressed Base64)
    console.info('[firebaseStorageService] Firebase Storage not configured. Falling back to local Base64 storage.');
    for (let p = 10; p <= 100; p += 30) {
      onProgress(p);
      await new Promise((r) => setTimeout(r, 60));
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  },

  /**
   * Upload user profile avatar to Firebase Storage
   * @param {string} userId 
   * @param {File|Blob} file 
   * @param {Function} [onProgress]
   * @returns {Promise<string>} Download URL
   */
  uploadAvatar: async (userId, file, onProgress = () => {}) => {
    if (!file) throw new Error('No avatar file provided.');

    let compressedFile = file;
    try {
      const compressedBase64 = await compressAndResizeImage(file, {
        maxWidth: 320,
        maxHeight: 320,
        quality: 0.85,
        maxInputSizeMb: 3,
      });
      const response = await fetch(compressedBase64);
      compressedFile = await response.blob();
    } catch (err) {
      console.warn('[firebaseStorageService] Avatar compression skipped:', err);
    }

    if (isFirebaseConfigured && storage && userId) {
      return new Promise((resolve, reject) => {
        const storagePath = `avatars/${userId}/avatar_${Date.now()}.jpg`;
        const fileRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(fileRef, compressedFile, {
          contentType: 'image/jpeg',
        });

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          },
          (error) => {
            console.error('[firebaseStorageService] Avatar upload error:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress(100);
            resolve(downloadURL);
          }
        );
      });
    }

    // Local fallback
    onProgress(100);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  },

  /**
   * Delete file from Firebase Storage by URL (optional cleanup)
   * @param {string} fileUrl 
   */
  deleteFileByUrl: async (fileUrl) => {
    if (!isFirebaseConfigured || !storage || !fileUrl || !fileUrl.startsWith('https://firebasestorage')) {
      return;
    }
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.warn('[firebaseStorageService] Could not delete old file:', error);
    }
  },
};
