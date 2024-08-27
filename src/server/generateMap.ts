import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

export async function generateHeatMap(
  temperatures: number[][],
  mapImagePath: string,
  outputImagePath: string
): Promise<void> {
  const width = temperatures[0].length;
  const height = temperatures.length;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const mapImage = await loadImage(mapImagePath);
  ctx.drawImage(mapImage, 0, 0, width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const temperature = temperatures[y][x];
      ctx.fillStyle = getColorForTemperature(temperature);
      ctx.fillRect(width - x - 1, height - y - 1, 1, 1);
    }
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputImagePath, buffer);
}

function getColorForTemperature(temp: number): string {
  const red = Math.min(255, temp * 2);

  if (red == 255) {
    return 'transparent';
  }

  if (temp <= 32) {
    return '#0000FF';
  } else if (temp <= 50) {
    return lerpColor('#0000FF', '#00FFFF', (temp - 32) / (50 - 32));
  } else if (temp <= 68) {
    return lerpColor('#00FFFF', '#00FF00', (temp - 50) / (68 - 50));
  } else if (temp <= 78) {
    return lerpColor('#00FF00', '#FFFF00', (temp - 68) / (78 - 68));
  } else if (temp <= 104) {
    return lerpColor('#e6ff00', '#ff0000', (temp - 78) / (104 - 78));
  } else {
    return lerpColor('#FF4400', '#FF0000', (temp - 104) / (122 - 104));
  }
}

function lerpColor(color1: string, color2: string, t: number) {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + t * (r2 - r1));
  const g = Math.round(g1 + t * (g2 - g1));
  const b = Math.round(b1 + t * (b2 - b1));

  return `rgb(${r}, ${g}, ${b})`;
}
