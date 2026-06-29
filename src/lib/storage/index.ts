import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export interface StorageProvider {
  upload(path: string, file: File): Promise<string>;
  getUrl(path: string): string;
  delete(path: string): Promise<void>;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const storage: StorageProvider = {
  async upload(filePath: string, file: File): Promise<string> {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("File type not allowed. Use JPEG, PNG, WebP, or GIF.");
    }
    if (file.size > MAX_SIZE) {
      throw new Error("File too large. Max 5MB.");
    }

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuid()}${ext}`;
    const dest = path.join(UPLOAD_DIR, filename);

    await mkdir(UPLOAD_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(dest, Buffer.from(bytes));

    return `/uploads/${filename}`;
  },

  getUrl(filePath: string): string {
    return filePath;
  },

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), "public", filePath);
    try {
      const { unlink } = await import("fs/promises");
      await unlink(fullPath);
    } catch {
      // Soft fail — file might not exist
    }
  },
};
