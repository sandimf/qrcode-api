import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// QR Code generation function with custom styling
const generateQRCode = async (url, customFilename = null) => {
    let browser;
    try {
        // Launch headless browser
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport size
        await page.setViewport({ width: 1400, height: 1400 });
        
        // Get logo base64
        const logoBase64 = await getLogoBase64();
        
        // Create HTML content with your custom QR styling
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://unpkg.com/qr-code-styling@1.9.2/lib/qr-code-styling.js"></script>
        </head>
        <body style="margin: 0; padding: 50px; background: white;">
            <div id="qrcode"></div>
            <script>
                const qrCode = new QRCodeStyling({
                    width: 1200,
                    height: 1200,
                    type: "canvas",
                    data: "${url}",
                    image: "${logoBase64 ? `data:image/png;base64,${logoBase64}` : ''}",
                    backgroundOptions: {
                        color: "transparent",
                    },
                    cornersSquareOptions: {
                        color: "#1B1817",
                        type: "extra-rounded",
                    },
                    cornersDotOptions: {
                        color: "#1B1817",
                        type: "dot",
                    },
                    dotsOptions: {
                        color: "#1B1817",
                        type: "dots",
                    },
                    imageOptions: {
                        imageSize: 0.5,
                        margin: 20,
                        hideBackgroundDots: true,
                        crossOrigin: "anonymous",
                    },
                });
                
                qrCode.append(document.getElementById("qrcode"));
            </script>
        </body>
        </html>
        `;
        
        // Set content and wait for QR code to render
        await page.setContent(htmlContent);
        await page.waitForSelector('#qrcode canvas', { timeout: 5000 }); // Wait for QR code to render
        
        // Generate filename (custom or unique)
        let filename;
        if (customFilename) {
            // Sanitize custom filename and ensure .png extension
            const sanitized = customFilename.replace(/[^a-zA-Z0-9_-]/g, '_');
            filename = sanitized.endsWith('.png') ? sanitized : `${sanitized}.png`;
        } else {
            filename = `qr_${uuidv4()}.png`;
        }
        const filepath = path.join(__dirname, "../public/images", filename);
        
        // Take screenshot of the QR code
        const qrElement = await page.$('#qrcode canvas');
        if (qrElement) {
            await qrElement.screenshot({ 
                path: filepath,
                type: 'png'
            });
        } else {
            throw new Error('QR code element not found');
        }
        
        return {
            filename,
            filepath,
            url: `/images/${filename}`
        };
        
    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

// Helper function to get logo as base64
const getLogoBase64 = async () => {
    try {
        const logoPath = path.join(__dirname, "../public/logo/klinik_gunung.png");
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            return logoBuffer.toString('base64');
        }
        return '';
    } catch (error) {
        console.log('Logo not found, proceeding without logo');
        return '';
    }
};

// API Handler function
export const generateQR = async (inputUrl, customFilename = null) => {
    try {
        // Validate URL
        if (!inputUrl) {
            throw new Error('URL parameter is required');
        }

        // Add protocol if missing
        let validUrl = inputUrl;
        if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
            validUrl = 'https://' + inputUrl;
        }

        // Generate QR code
        const result = await generateQRCode(validUrl, customFilename);
        
        return {
            success: true,
            message: 'QR code generated successfully',
            data: {
                originalUrl: validUrl,
                qrImagePath: result.url,
                qrImageFilename: result.filename,
                fullPath: result.filepath
            }
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to generate QR code',
            error: error.message
        };
    }
};

// Express.js compatible handler
export default async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed. Use POST or GET.'
        });
    }

    try {
        // Get URL and filename from query params or body
        const url = req.method === 'GET' ? req.query.url : req.body.url;
        const filename = req.method === 'GET' ? req.query.filename : req.body.filename;
        
        const result = await generateQR(url, filename);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
