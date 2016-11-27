export function setPixel(x: number, y: number, color: Color, image: ImageData) {
    var width = image.width;
    var height = image.height;
    if (x >= width || x < 0 || y < 0 || y >= height) {
        return;
    }
    x = Math.floor(x);
    y = Math.floor(y);
    if (color.a === 0) {
        return;
    }
    var offset = (width * y + x) * 4;
    var bitmap = image.data;
    var dstR = bitmap[offset];
    var dstG = bitmap[offset + 1];
    var dstB = bitmap[offset + 2];
    var dstA = bitmap[offset + 3];
    dstA = dstA / 255.0;
    var srcA = color.a / 255.0;
    var dstBlend = dstA * (1 - srcA);
    var newA = srcA + dstBlend;
    bitmap[offset] = (color.r * srcA + dstR * dstBlend) / newA;
    bitmap[offset + 1] = (color.g * srcA + dstG * dstBlend) / newA;
    bitmap[offset + 2] = (color.b * srcA + dstB * dstBlend) / newA;
    bitmap[offset + 3] = newA * 255;
}