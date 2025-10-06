# QR Code Generator API

An API for generating styled QR codes that include logo and custom design.

## Features

* Generate QR codes with custom styling
* Automatically save images to the `public/images/` folder
* Return JSON with the image path
* Support for both POST and GET requests
* Automatic URL validation

## Installation

```bash
cd api
npm install
npm start
```

The server will run at `http://localhost:3001`

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

The generated QR codes have custom styling:

* **Size:** 1200x1200 pixels
* **Logo:** Logo (If Avaible)
* **Corner Style:** Extra-rounded squares
* **Dot Style:** Rounded dots
* **Color:** #1B1817 (dark brown)
* **Background:** Transparent
* **Image Size:** 40% of the QR code
* **Margin:** 20px

## File Structure

```
api/
├── server.js              # Express server
├── api/qr.js              # QR generation logic
├── public/
│   ├── images/            # Generated QR codes
│   └── logo/              # Logo files
├── package.json
└── README.md
```

## Error Handling

In case of an error, the API will return:

```json
{
  "success": false,
  "message": "Failed to generate QR code",
  "error": "Error description"
}
```

## Dependencies

* **express**: Web framework
* **puppeteer**: Headless browser for rendering QR codes
* **qr-code-styling**: Library for QR code styling
* **uuid**: Generate unique filenames

## Notes

* QR code images are saved in the `public/images/` folder
* Each QR code has a unique filename generated with UUID
* The clinic logo will automatically be included if the file is available
* The API supports URLs with or without a protocol (http/https)
