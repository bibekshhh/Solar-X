azimuth = -25;

if (azimuth <= 0 && azimuth >= -180) {
    azimuth = 0 - (180 - (360 + azimuth));
}
console.log(azimuth)