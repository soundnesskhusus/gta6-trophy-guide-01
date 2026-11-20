// Leonida Trophy Guide — entrypoint (Node 22, standard library only).
// The guide itself is plain static files under app/ (index.html, ES modules,
// CSS, and data/trophies.json), and screenshots/ holds 3 or 4 renders of it.
// This program hands the entry in: it copies app/ and screenshots/ next to
// this file into the output directory, then writes dossier.json there — the
// summary the judge reads — using the vendored make.fun library, which must
// stay untouched so the scorer's own copy writes identical bytes.
//
// Run it locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader MAKEFUN_OUTPUT_DIR is unset and the output goes to /output.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The scorer's caps for this bounty: the dossier text is capped at 160 KiB,
// at most 4 screenshots of 256 KiB each, app/ at most 993 entries and 48 MiB.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function copyInto(destination: string, name: string, sourceRoot: string): void {
  const source = join(sourceRoot, name);
  if (!existsSync(source)) return;
  cpSync(source, join(destination, name), { recursive: true });
}

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
copyInto(outputDir, 'app', repoRoot);
copyInto(outputDir, 'screenshots', repoRoot);

writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, DOSSIER_CAPS));
