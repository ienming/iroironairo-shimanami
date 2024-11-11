import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getColor, getGpsCoordinates } from './helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folderPath = path.join(__dirname, '../tests');
const availableFormat = ['JPG', 'JPEG', 'jpg', 'jpeg'];

const allImgs = await Promise.all(
    fs.readdirSync(folderPath).map(async fileName => {
        const result = availableFormat.some(format => fileName.includes(format));
        if (result) {
            const imgPath = path.join(folderPath, fileName);
            const buffer = fs.readFileSync(imgPath);

            // 取得 GPS 座標和顏色
            const coordinates = getGpsCoordinates(buffer);
            const color = await getColor(imgPath);

            if (coordinates) {
                coordinates.name = fileName;
                coordinates.color = color;
                return coordinates;
            }
        }
        return null;
    })
);

// 過濾掉空值
const filteredImgs = allImgs.filter(item => item !== null);
console.log(filteredImgs);