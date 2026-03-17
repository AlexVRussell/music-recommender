require('dotenv').config();

const http = require('http');
const path = require('path');
const fs = require('fs/promises');
const { getArtistRecommendations } = require('./js/spotifyHandler');

const PORT = process.env.PORT || 3000;
const STATIC_FILES = {
    '/': path.join(__dirname, 'index.html'),
    '/css/styles.css': path.join(__dirname, 'css', 'styles.css'),
    '/js/app.js': path.join(__dirname, 'js', 'app.js')
};

const CONTENT_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
};

const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, 'http://localhost');

    if (request.method === 'GET' && requestUrl.pathname === '/api/recommendations') {
        const artist = requestUrl.searchParams.get('artist')?.trim();

        if (!artist) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Artist query is required.' }));
            return;
        }

        try {
            const recommendations = await getArtistRecommendations(artist);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(recommendations));
        } catch (error) {
            const statusCode = error.message === 'No matching artist found' ? 404 : 500;
            response.writeHead(statusCode, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }

        return;
    }

    if (request.method !== 'GET') {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const filePath = STATIC_FILES[requestUrl.pathname];

    if (!filePath) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Not found');
        return;
    }

    try {
        const fileContents = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        const contentType = CONTENT_TYPES[ext] || 'text/plain';

        response.writeHead(200, { 'Content-Type': contentType });
        response.end(fileContents);
    } catch (error) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Failed to load file' }));
    }
});

server.listen(PORT, () => {
    console.log(`Music recommender server listening on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error('Port ' + PORT + ' is already in use. Stop the other server or run with a different PORT.');
        process.exit(1);
    }

    throw error;
});