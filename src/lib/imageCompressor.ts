/**
 * Compresses an image string aggressively for mobile AI Coach requests.
 * This keeps Vercel/API payload small and prevents mobile upload failures.
 */
export async function compressImage(base64Str: string, maxWidth = 720, quality = 0.55): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      const largestSide = Math.max(width, height);
      if (largestSide > maxWidth) {
        const scale = maxWidth / largestSide;
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      resolve(base64Str);
    };
  });
}
