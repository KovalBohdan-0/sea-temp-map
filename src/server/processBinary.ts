import fs from 'fs';

const BINARY_DIMENSION_X = 36000;
const BINARY_DIMENSION_Y = 17999;
const BINARY_SCALE = 10;

export function processBinary(filePath: string): number[][] {
  const buffer = fs.readFileSync(filePath);
  const temperatures: number[][] = Array.from({ length: BINARY_DIMENSION_Y / BINARY_SCALE }, () =>
    Array(BINARY_DIMENSION_X / BINARY_SCALE).fill(0)
  );

  const data = Array.from({ length: BINARY_DIMENSION_Y }, (_, y) =>
    Array.from({ length: BINARY_DIMENSION_X }, (_, x) =>
      buffer.readUInt8(y * BINARY_DIMENSION_X + x)
    )
  );

  for (let y = 0; y < temperatures.length; y++) {
    for (let x = 0; x < temperatures[0].length; x++) {
      const flippedX = BINARY_DIMENSION_X / BINARY_SCALE - 1 - x;

      temperatures[y][x] = computeAverage(flippedX * BINARY_SCALE, y * BINARY_SCALE, data);
    }
    console.log(y);
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
