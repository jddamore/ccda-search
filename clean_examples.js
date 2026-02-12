#!/usr/bin/env node
/**
 * Clean inner HTML of elements with IDs:
 *   - guide_examples
 *   - cdasearch_examples
 *
 * Usage:
 *   node clean-examples.js /path/to/folder
 *
 * Notes:
 * - Recursively scans for .html/.htm files.
 * - Creates a .bak backup next to each modified file.
 */

const fs = require('fs/promises');
const path = require('path');
const cheerio = require('cheerio');

const TARGET_IDS = ['guide_examples', 'cdasearch_examples'];
const HTML_EXTENSIONS = new Set(['.html', '.htm']);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

function clearTargetContent(html) {
  const $ = cheerio.load(html, { decodeEntities: false });

  let modified = false;
  for (const id of TARGET_IDS) {
    // Use attribute selector to avoid CSS.escape dependency
    const sel = `[id="${id}"]`;
    const $els = $(sel);
    if ($els.length > 0) {
      $els.each((_, el) => {
        const current = $(el).html();
        if (current && current.trim().length > 0) {
          $(el).html(''); // clear inner HTML, keep the tag
          modified = true;
        }
      });
    }
  }

  return { modified, output: $.html() };
}

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!HTML_EXTENSIONS.has(ext)) return { skipped: true };

  const original = await fs.readFile(filePath, 'utf8');
  const { modified, output } = clearTargetContent(original);

  if (!modified) return { modified: false };

  const backupPath = `${filePath}.bak`;
  try {
    await fs.access(backupPath);
    // backup exists; keep it
  } catch {
    await fs.writeFile(backupPath, original, 'utf8');
  }

  await fs.writeFile(filePath, output, 'utf8');
  return { modified: true };
}

async function main() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error('Usage: node clean-examples.js /path/to/folder');
    process.exit(1);
  }

  const absDir = path.resolve(targetDir);
  let total = 0;
  let modified = 0;

  for await (const file of walk(absDir)) {
    const ext = path.extname(file).toLowerCase();
    if (!HTML_EXTENSIONS.has(ext)) continue;
    total += 1;
    try {
      const result = await processFile(file);
      if (result.modified) {
        modified += 1;
        console.log(`✔ Modified: ${file}`);
      }
    } catch (err) {
      console.error(`✖ Error processing ${file}:`, err.message);
    }
  }

  console.log('\nDone.');
  console.log(`Scanned HTML files: ${total}`);
  console.log(`Files modified:     ${modified}`);
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});