import dotenv from 'dotenv'; // Import dotenv
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import fetch from 'node-fetch'; 

const app = express();
const __dirname = path.resolve(); // Get the absolute path of the current directory
console.log(__dirname);
dotenv.config({ path: path.join(__dirname, 'backend/.env') });
const PORT = process.env.PORT || 3000;
const url = process.env.GOOGLE_WEB_APP_URL; // Store the Google Web App URL in .env
console.log('Google Sheets URL:', url);

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '/public')));

// Endpoint for handling form submissions
app.post('/submit-RSVP', async (req, res) => {
    const data = req.body;

    // Log the received data
    console.log('RSVP Data:', data);

    try {
        // Forward the data to the Google Sheets Web App
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            res.json({ status: 'success', message: 'RSVP submitted successfully!' });
        } else {
            console.error('Google Sheets Error:', result);
            res.status(500).json({ status: 'error', message: 'Failed to save RSVP to Google Sheets.' });
        }
    } catch (error) {
        console.error('Error forwarding data:', error);
        res.status(500).json({ status: 'error', message: 'An error occurred.' });
    }
});

// Serve the index.html file for the root route
app.get('/', (_req, res) => {
    const filePath = path.join(__dirname, '/public/index.html'); // Ensure this is an absolute path
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('Sent:', filePath);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
