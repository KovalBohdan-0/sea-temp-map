import express from 'express';
import multer from 'multer';
import { processBinary } from './processBinary.js';
import { generateHeatMap } from './generateMap.js';
import cors from 'cors';
import { unzipFile } from './unzip.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  console.log('File uploaded');
  await unzipFile(req.file.path, './public/extracted');
  console.log('File uploaded and extracted');
  const temperatures = processBinary('./public/extracted/sst.grid', 36000, 17999);
  console.log('Binary processed');
  await generateHeatMap(temperatures, './public/empty-map.jpg', './public/output-map.png');
  res.sendFile('./public/output-map.png', { root: '.' });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
