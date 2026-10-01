/**
 * Client-Side Image Compressor using HTML Canvas
 * Safely scales and converts uploaded images to optimized base64 JPEG
 */

export async function compressAndResizeImage(file, {
  maxWidth = 200,
  maxHeight = 200,
  quality = 0.85,
  maxInputSizeMb = 2
} = {}) {
  // Validate input type
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (JPEG, PNG, WebP).');
  }

  // Validate input size limit (2 MB)
  const maxBytes = maxInputSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`Image size exceeds the ${maxInputSizeMb}MB limit. Please choose a smaller photo.`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read selected image file.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image in browser.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale down to max dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context could not be created.'));
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight base64 JPEG
        try {
          const base64Data = canvas.toDataURL('image/jpeg', quality);
          resolve(base64Data);
        } catch (err) {
          reject(err);
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}
