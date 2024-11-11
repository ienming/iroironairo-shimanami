import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import getGpsCoordinates from './helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folderPath = path.join(__dirname, '../../照片/Shimanami');
const availableFormat = ['JPG', 'JPEG', 'jpg', 'jpeg'];
const allImgs = [];

fs.readdirSync(folderPath).map(fileName => {
    const result = availableFormat.some(format => {
        return fileName.includes(format);
    })
    if (result) {
        const imgPath = path.join(folderPath, fileName)
        // allImgs.push(imgPath);
        // Read GPS
        const buffer = fs.readFileSync(imgPath);
        const coordinates = getGpsCoordinates(buffer);
        if (coordinates) {
            coordinates.name = fileName;
            // console.log(coordinates);
            allImgs.push(coordinates);
        }
    };
});

console.log(allImgs);