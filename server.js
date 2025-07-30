// cirql-frontend/server.js

// --- START OF THE CRITICAL FIX ---
// We now import from 'http' instead of 'https'
const { createServer } = require('http');
// The NODE_TLS_REJECT_UNAUTHORIZED line is no longer needed and has been removed.
// --- END OF THE CRITICAL FIX ---

const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// The httpsOptions object is no longer needed and has been removed.

app.prepare().then(() => {
  // --- START OF THE CRITICAL FIX ---
  // createServer now uses the standard http module.
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    // Update the log to reflect http.
    console.log('> Ready on http://localhost:3000');
  });
  // --- END OF THE CRITICAL FIX ---
});