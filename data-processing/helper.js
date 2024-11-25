import exifParser from 'exif-parser';
import { writeFile } from 'node:fs';
import ColorThief from 'colorthief';
import sharp from 'sharp';
import fs from 'fs/promises';

export function getGpsCoordinates(buffer) {
    const parser = exifParser.create(buffer);
    const result = parser.parse();
    const gpsData = result.tags;

    if (gpsData && gpsData.GPSLatitude && gpsData.GPSLongitude) {
        const latitude = `${gpsData.GPSLatitude} ${gpsData.GPSLatitudeRef}`;
        const longitude = `${gpsData.GPSLongitude} ${gpsData.GPSLongitudeRef}`;
        return { latitude, longitude };
    } else {
        return null; // 無 GPS 資訊
    }
}

export async function getColor(path) {
    try {
        const color = await ColorThief.getColor(path);
        console.log(`取得照片顏色: ${path}`);
        return color;
    } catch (error) {
        throw new Error(`取得照片顏色失敗: ${error.message}`);
    }
}

export async function compressPhoto(inputPath, outputDir) {
    try {
        await fs.mkdir(outputDir, { recursive: true });

        const data = await sharp(inputPath)
            .jpeg({
                mozjpeg: true,
                quality: 50,
             })
            .toBuffer();

        const imgName = inputPath.split('/').pop();
        const outputPath = `${outputDir}/${imgName}`;
        await fs.writeFile(outputPath, data);

        console.log('圖片壓縮並儲存完成！');
    } catch (error) {
        throw new Error(`處理圖片時發生錯誤: ${error.message}`)
    }
}