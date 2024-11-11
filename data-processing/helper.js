import exifParser from 'exif-parser';
import { writeFile } from 'node:fs';
import ColorThief from 'colorthief';

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

export function writeData() {
    writeFile('message.txt', 'Hello Node.js', 'utf8', () => {
        console.log('success');
    });
}

export function getColor(path) {
    return new Promise((resolve, reject) => {
        ColorThief.getColor(path)
            .then(color => {
                console.log(`取得照片顏色: ${path}`);
                resolve(color);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}