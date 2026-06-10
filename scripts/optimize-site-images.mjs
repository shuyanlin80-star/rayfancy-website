import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "public/assets");
const outputRoot = path.join(sourceRoot, "optimized");
const imageDirs = ["products", "company"];
const imageExts = new Set([".jpg", ".jpeg"]);
const maxDimension = 1800;
const jpegQuality = "72";

function runSips(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("/usr/bin/sips", args, { stdio: "pipe" });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`sips failed (${code}): ${stderr}`));
      }
    });
  });
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(full));
    } else if (imageExts.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function optimizeImage(source) {
  const relative = path.relative(sourceRoot, source);
  const target = path.join(outputRoot, relative);
  const targetDir = path.dirname(target);
  const ext = path.extname(source).toLowerCase();
  await mkdir(targetDir, { recursive: true });

  const args = ["-Z", String(maxDimension)];
  if (ext === ".jpg" || ext === ".jpeg") {
    args.push("-s", "format", "jpeg", "-s", "formatOptions", jpegQuality);
  }
  args.push(source, "--out", target);
  await runSips(args);

  const before = (await stat(source)).size;
  const after = (await stat(target)).size;
  return { relative, before, after };
}

const allFiles = [];
for (const dir of imageDirs) {
  allFiles.push(...await walk(path.join(sourceRoot, dir)));
}

let beforeTotal = 0;
let afterTotal = 0;
for (const file of allFiles) {
  const result = await optimizeImage(file);
  beforeTotal += result.before;
  afterTotal += result.after;
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;
console.log(`Optimized ${allFiles.length} images: ${mb(beforeTotal)} -> ${mb(afterTotal)}`);
