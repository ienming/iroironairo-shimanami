import exifParser from 'exif-parser';
import { writeFile } from 'node:fs';

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

export function getColor() {
    console.log('get main color from photo');
}