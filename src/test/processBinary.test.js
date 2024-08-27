import * as chai from 'chai';
import fs from 'fs';
import { processBinary } from '../../dist/server/processBinary.js';

const expect = chai.expect;

describe('processBinary', () => {
  it('should correctly process the binary file and return temperatures', () => {
    const filePath = './src/test/data/test-data.bin';

    fs.writeFileSync(filePath, '');

    const width = 100;
    const height = 100;
    const buffer = Buffer.alloc(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = (y + x) % 256;
        buffer.writeUInt8(value, y * width + x);
      }
    }

    fs.writeFileSync(filePath, buffer);

    const temperatures = processBinary(filePath, 100, 100);

    expect(temperatures).to.be.an('array');
    expect(temperatures).to.have.length.above(0);
    expect(temperatures[0]).to.be.an('array');
    expect(temperatures[0][0]).to.be.a('number');
    expect(temperatures[0].length).equal(10);
    expect(temperatures.length).equal(10);
  });

  describe('processBinary', () => {
    it('should handle an empty binary file gracefully', () => {
      const filePath = './src/test/data/empty-test-data.bin';

      fs.writeFileSync(filePath, '');

      const temperatures = processBinary(filePath);

      expect(temperatures).to.be.an('array');
      expect(temperatures).to.have.length(0);
    });
  });

  after(() => {
    fs.unlinkSync('./src/test/data/empty-test-data.bin');
    fs.unlinkSync('./src/test/data/test-data.bin');
  });
});
