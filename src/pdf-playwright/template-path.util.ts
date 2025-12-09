import * as path from 'path';
import * as fs from 'fs';

export function resolveTemplatePath(fileName: string): string {
  const isProd = __dirname.includes('dist');

  const basePath = isProd
    ? path.join(process.cwd(), 'dist/pdf-playwright/template')
    : path.join(process.cwd(), 'src/pdf-playwright/template');

  const fullPath = path.join(basePath, fileName);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Template not found: ${fullPath}`);
  }

  return fullPath;
}
