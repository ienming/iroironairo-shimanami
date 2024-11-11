import exifParser from 'exif-parser';

export default function getGpsCoordinates(buffer) {
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
