import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const assetsDir = path.join(distDir, 'assets');
const distSwPath = path.join(distDir, 'sw.js');

if (!fs.existsSync(distSwPath)) {
  console.log('[CareFlow SW Injector] No dist/sw.js found, skipping injection.');
  process.exit(0);
}

const buildAssets = [];

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.png') || file.endsWith('.svg') || file.endsWith('.webp')) {
      buildAssets.push(`/assets/${file}`);
    }
  }
}

console.log(`[CareFlow SW Injector] Found ${buildAssets.length} production assets to inject into dist/sw.js`);

let swContent = fs.readFileSync(distSwPath, 'utf8');
const injectionRegex = /\/\/ @INJECT_BUILD_ASSETS_START@[\s\S]*?\/\/ @INJECT_BUILD_ASSETS_END@/;

const replacement = `// @INJECT_BUILD_ASSETS_START@\nconst DYNAMIC_BUILD_ASSETS = ${JSON.stringify(buildAssets, null, 2)};\n// @INJECT_BUILD_ASSETS_END@`;

if (injectionRegex.test(swContent)) {
  swContent = swContent.replace(injectionRegex, replacement);
  fs.writeFileSync(distSwPath, swContent, 'utf8');
  console.log('[CareFlow SW Injector] Successfully injected bundle hashes into dist/sw.js for instant offline pre-caching!');
} else {
  console.warn('[CareFlow SW Injector] Injection markers not found in dist/sw.js');
}
