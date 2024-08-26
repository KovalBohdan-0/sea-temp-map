import fs from 'fs';
import unzipper from 'unzipper';

export async function unzipFile(zipPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: outputPath }))
      .on('close', resolve)
      .on('error', reject);
  });
}
