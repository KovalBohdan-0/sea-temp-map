import fs from 'fs';

const BINARY_SCALE = 10;

export function processBinary(
  filePath: string,
  binaryDimensionX: number,
  binaryDimensionY: number
): number[][] {
  const buffer = fs.readFileSync(filePath);
  const temperatures: number[][] = Array.from({ length: binaryDimensionY / BINARY_SCALE }, () =>
    Array(binaryDimensionX / BINARY_SCALE).fill(0)
  );

  const data = Array.from({ length: binaryDimensionY }, (_, y) =>
    Array.from({ length: binaryDimensionX }, (_, x) =>
      buffer.readUInt8(y * binaryDimensionX + x)
    )
  );

  for (let y = 0; y < temperatures.length; y++) {
    for (let x = 0; x < temperatures[0].length; x++) {
      const flippedX = binaryDimensionX / BINARY_SCALE - 1 - x;

      temperatures[y][x] = computeAverage(flippedX * BINARY_SCALE, y * BINARY_SCALE, data);
    }
  }

  return temperatures;
}

function computeAverage(startX: number, startY: number, data: number[][]): number {
  let sum = 0;
  let count = 0;

  for (let dy = 0; dy < BINARY_SCALE; dy++) {
    const y = startY + dy;
    if (y < 0 || y >= data.length || !data[y]) continue;

    for (let dx = 0; dx < BINARY_SCALE; dx++) {
      const x = startX + dx;
      if (x < 0 || x >= data[y].length) continue;

      sum += data[y][x];
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}
