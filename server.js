const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": mimeTypes[extension] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(response);
}

http
  .createServer((request, response) => {
    const cleanUrl = decodeURIComponent(request.url.split("?")[0]);
    const requestedPath = path.normalize(cleanUrl).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(root, requestedPath);

    if (cleanUrl === "/") {
      filePath = path.join(root, "index.html");
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      sendFile(response, filePath);
      return;
    }

    sendFile(response, path.join(root, "index.html"));
  })
  .listen(port, () => {
    console.log(`Portfolio site running at http://localhost:${port}`);
  });
