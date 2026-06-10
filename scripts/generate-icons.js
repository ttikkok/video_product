const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../unpackage/res/icons');

const iconSizes = [
    { name: '72x72.png', size: 72 },
    { name: '96x96.png', size: 96 },
    { name: '144x144.png', size: 144 },
    { name: '192x192.png', size: 192 },
    { name: '1024x1024.png', size: 1024 },
    { name: '76x76.png', size: 76 },
    { name: '152x152.png', size: 152 },
    { name: '20x20.png', size: 20 },
    { name: '40x40.png', size: 40 },
    { name: '167x167.png', size: 167 },
    { name: '29x29.png', size: 29 },
    { name: '58x58.png', size: 58 },
    { name: '80x80.png', size: 80 },
    { name: '120x120.png', size: 120 },
    { name: '180x180.png', size: 180 },
    { name: '60x60.png', size: 60 },
    { name: '87x87.png', size: 87 }
];

function createSimplePNG(size) {
    const width = size;
    const height = size;
    
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    function crc32(buf) {
        let crc = 0xFFFFFFFF;
        const table = [];
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) {
                c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            }
            table[i] = c;
        }
        for (let i = 0; i < buf.length; i++) {
            crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }
    
    function createChunk(type, data) {
        const length = Buffer.alloc(4);
        length.writeUInt32BE(data.length);
        const typeBuffer = Buffer.from(type);
        const crcData = Buffer.concat([typeBuffer, data]);
        const crc = Buffer.alloc(4);
        crc.writeUInt32BE(crc32(crcData));
        return Buffer.concat([length, typeBuffer, data, crc]);
    }
    
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 2;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    
    const rawData = [];
    for (let y = 0; y < height; y++) {
        rawData.push(0);
        for (let x = 0; x < width; x++) {
            const cx = width / 2;
            const cy = height / 2;
            const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
            const maxDist = Math.min(width, height) / 2;
            
            if (dist < maxDist * 0.7) {
                rawData.push(255, 138, 0);
            } else if (dist < maxDist * 0.9) {
                rawData.push(255, 45, 85);
            } else {
                rawData.push(255, 255, 255);
            }
        }
    }
    
    const { deflateSync } = require('zlib');
    const compressed = deflateSync(Buffer.from(rawData));
    
    const ihdrChunk = createChunk('IHDR', ihdr);
    const idatChunk = createChunk('IDAT', compressed);
    const iendChunk = createChunk('IEND', Buffer.alloc(0));
    
    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

iconSizes.forEach(({ name, size }) => {
    const png = createSimplePNG(size);
    fs.writeFileSync(path.join(iconsDir, name), png);
    console.log(`Created ${name}`);
});

console.log('All icons generated successfully!');
