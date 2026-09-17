import http from 'node:http';
import handler from 'serve-handler';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Heroku injects PORT; fall back for local `npm start`
const port = Number(process.env.PORT) || 3000;

const server = http.createServer((request, response) =>
  handler(request, response, {
    public: distDir,
    // SPA fallback — React Router paths must return index.html
    rewrites: [{ source: '**', destination: '/index.html' }],
  })
);

server.listen(port, '0.0.0.0', () => {
  console.log(`LinkedIn Distribution serving ${distDir} on 0.0.0.0:${port}`);
});
