// In cirql-frontend/server.js

// --- START OF THE GUARANTEED FIX ---
// This line tells this specific Node.js process to allow connections to
// localhost servers with self-signed certificates. It is the definitive fix.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// This line is for verification. You should see it in your terminal when you restart.
console.log('[SERVER.JS] NODE_TLS_REJECT_UNAUTHORIZED is set to:', process.env.NODE_TLS_REJECT_UNAUTHORIZED);
// --- END OF THE GUARANTEED FIX ---


const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});