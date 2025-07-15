# QR Code Generator API

API untuk membuat QR code dengan styling kustom yang mencakup logo klinik dan desain yang telah disesuaikan.

## Features

- ✅ Generate QR code dengan styling kustom
- ✅ Logo klinik terintegrasi
- ✅ Otomatis menyimpan gambar ke folder `public/images/`
- ✅ Mengembalikan JSON dengan path gambar
- ✅ Support POST dan GET request
- ✅ Validasi URL otomatis

## Installation

```bash
cd api
npm install
npm start
```

Server akan berjalan di `http://localhost:3001`

## API Endpoints

### 1. Generate QR Code (POST)

**Endpoint:** `POST /api/qr`

**Request Body:**
```json
{
  "url": "https://example.com",
  "filename": "my_custom_qr" // Optional: custom filename
}
```

**Examples:**
```bash
# With custom filename
curl -X POST http://localhost:3001/api/qr \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com", "filename":"google_qr"}'

# Without custom filename (auto-generated UUID)
curl -X POST http://localhost:3001/api/qr \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
```

### 2. Generate QR Code (GET)

**Endpoint:** `GET /api/qr?url=https://example.com&filename=my_custom_qr`

**Examples:**
```bash
# With custom filename
curl "http://localhost:3001/api/qr?url=https://google.com&filename=google_qr"

# Without custom filename (auto-generated UUID)
curl "http://localhost:3001/api/qr?url=https://google.com"
```

## Response Format

```json
{
  "success": true,
  "message": "QR code generated successfully",
  "data": {
    "originalUrl": "https://google.com",
    "qrImagePath": "/images/qr_442618c5-8654-4b67-bb2c-40e50416c004.png",
    "qrImageFilename": "qr_442618c5-8654-4b67-bb2c-40e50416c004.png",
    "fullPath": "/Users/aksabumilangit/Projects/qr/api/public/images/qr_442618c5-8654-4b67-bb2c-40e50416c004.png"
  }
}
```

## QR Code Styling

QR code yang dihasilkan memiliki styling kustom:
- **Size:** 1200x1200 pixels
- **Logo:** Klinik Gunung (jika tersedia)
- **Corner Style:** Extra-rounded squares
- **Dot Style:** Rounded dots
- **Color:** #1B1817 (dark brown)
- **Background:** Transparent
- **Image Size:** 40% dari QR code
- **Margin:** 20px

## File Structure

```
api/
├── server.js              # Express server
├── api/qr.js             # QR generation logic
├── public/
│   ├── images/           # Generated QR codes
│   └── logo/            # Logo files
├── package.json
└── README.md
```

## Error Handling

Jika terjadi error, API akan mengembalikan:

```json
{
  "success": false,
  "message": "Failed to generate QR code",
  "error": "Error description"
}
```

## Dependencies

- **express**: Web framework
- **puppeteer**: Headless browser untuk rendering QR code
- **qr-code-styling**: Library untuk styling QR code
- **uuid**: Generate unique filenames

## Notes

- Gambar QR code disimpan di folder `public/images/`
- Setiap QR code memiliki filename unik menggunakan UUID
- Logo klinik akan otomatis dimasukkan jika file tersedia
- API mendukung URL dengan atau tanpa protocol (http/https)
