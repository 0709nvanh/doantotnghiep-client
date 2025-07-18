import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const BASE_PATH = "/doantotnghiep-client";

const mimeTypes = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".wav": "audio/wav",
	".mp4": "video/mp4",
	".woff": "application/font-woff",
	".ttf": "application/font-ttf",
	".eot": "application/vnd.ms-fontobject",
	".otf": "application/font-otf",
	".wasm": "application/wasm",
};

const server = createServer(async (req, res) => {
	console.log(`${req.method} ${req.url}`);

	let filePath = req.url;

	// Remove base path if present
	if (filePath.startsWith(BASE_PATH)) {
		filePath = filePath.substring(BASE_PATH.length);
	}

	// Default to index.html for root or missing files
	if (filePath === "/" || filePath === "") {
		filePath = "/index.html";
	}

	// Remove query string
	filePath = filePath.split("?")[0];

	// Construct full file path
	const fullPath = join(__dirname, "dist", filePath);

	try {
		const data = await readFile(fullPath);
		const ext = extname(fullPath);
		const contentType = mimeTypes[ext] || "application/octet-stream";

		res.writeHead(200, { "Content-Type": contentType });
		res.end(data);
	} catch (error) {
		// If file not found, serve index.html for SPA routing
		if (error.code === "ENOENT") {
			try {
				const indexData = await readFile(join(__dirname, "dist", "index.html"));
				res.writeHead(200, { "Content-Type": "text/html" });
				res.end(indexData);
			} catch (indexError) {
				res.writeHead(404, { "Content-Type": "text/plain" });
				res.end("404 Not Found");
			}
		} else {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("500 Internal Server Error");
		}
	}
});

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}${BASE_PATH}`);
	console.log(`Press Ctrl+C to stop`);
});
