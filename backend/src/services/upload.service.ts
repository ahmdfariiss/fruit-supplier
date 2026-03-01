// Upload service — image processing with Sharp
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';

const MAX_WIDTH = 800;
const MAX_FILE_SIZE = 500 * 1024; // 500KB

export const processImage = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const outputPath = path.join(env.UPLOAD_DIR, `${baseName}.webp`);

  await sharp(filePath)
    .resize(MAX_WIDTH, undefined, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);

  // Remove original if different from output
  if (filePath !== outputPath) {
    fs.unlinkSync(filePath);
  }

  return `${baseName}.webp`;
};
