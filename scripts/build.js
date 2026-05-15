const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const copyTargets = ["index.html", "src", "_redirects"];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const target of copyTargets) {
  const sourcePath = path.join(root, target);
  const destinationPath = path.join(dist, target);

  if (!fs.existsSync(sourcePath)) {
    continue;
  }

  fs.cpSync(sourcePath, destinationPath, { recursive: true });
}

console.log("Static site built to dist/");
