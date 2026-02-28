import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outFile = path.join(root, 'genki-config.js');

const requiredPublicVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const optionalVars = ['SQUARE_APP_ID', 'SQUARE_LOCATION_ID'];

const readVar = (name) => (process.env[name] || '').trim();
const config = {};

for (const name of requiredPublicVars) {
  const value = readVar(name);
  if (!value) {
    console.warn(`[generate-config] Missing required env var: ${name}`);
  }
  config[name] = value || `REPLACE_WITH_${name}`;
}

for (const name of optionalVars) {
  const value = readVar(name);
  config[name] = value || `REPLACE_WITH_${name}`;
}

const fileBody = `// Auto-generated at build time. Do not commit.\nwindow.__GENKI_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;
fs.writeFileSync(outFile, fileBody, 'utf8');
console.log(`[generate-config] Wrote ${outFile}`);
