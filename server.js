import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import qrHandler from './api/qr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/logo', express.static(path.join(__dirname, 'public/logo')));

// QR Code API endpoint
app.post('/api/qr', qrHandler);
app.get('/api/qr', qrHandler);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'QR Code API is running' });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'QR Code Generator API',
        endpoints: {
            'POST /api/qr': 'Generate QR code with URL in request body: {"url": "https://example.com", "filename": "my_qr"}',
            'GET /api/qr?url=https://example.com&filename=my_qr': 'Generate QR code with URL and optional filename as query parameters',
            'GET /health': 'Health check endpoint'
        },
        example: {
            curl_post: 'curl -X POST http://localhost:3001/api/qr -H "Content-Type: application/json" -d \'{"url":"https://google.com", "filename":"google_qr"}\'',
            curl_get: 'curl "http://localhost:3001/api/qr?url=https://google.com&filename=google_qr"'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`QR Code API server is running on http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}`);
});
