import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getColor, getGpsCoordinates, compressPhoto } from './helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folderPath = path.join(__dirname, '../tests');
const availableFormat = ['JPG', 'JPEG', 'jpg', 'jpeg'];

const allImgs = await Promise.all(
    fs.readdirSync(folderPath).map(async fileName => {
        const result = availableFormat.some(format => fileName.includes(format));
        if (result) {
            try {
                const imgPath = path.join(folderPath, fileName);
                const buffer = fs.readFileSync(imgPath);
    
                // 取得 GPS 座標和顏色
                const coordinates = getGpsCoordinates(buffer);
                const color = await getColor(imgPath);
    
                // 壓縮照片
                const compressedFolderPath = path.join(__dirname, '../compressed');
                await compressPhoto(imgPath, compressedFolderPath);
    
                if (coordinates) {
                    const result = {};
                    result.coords = [coordinates.longitude, coordinates.latitude];
                    result.name = fileName;
                    result.id = fileName;
                    result.color = color;
                    // console.log(result);
                    return result;
                }
            } catch (error) {
                return null;
            }
        } else {
            return null;
        }
    })
);

const validImgs = allImgs.filter(img => img);
const outputDataPath = path.join(__dirname, '../frontend/public/imagesData.json');
fs.writeFile(outputDataPath, JSON.stringify(validImgs, null, 2), 'utf8', (err) => {
    if (err) {
        console.error('寫入 JSON 檔案失敗:', err);
    } else {
        console.log('JSON 檔案寫入成功！');
    }
});