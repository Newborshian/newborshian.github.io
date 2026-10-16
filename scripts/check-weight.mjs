// Budget d'écoconception : échoue si le site construit dépasse le poids maximal.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BUDGET_KB = 100;

function totalSize(dir) {
  return readdirSync(dir).reduce((sum, name) => {
    const path = join(dir, name);
    const stats = statSync(path);
    return sum + (stats.isDirectory() ? totalSize(path) : stats.size);
  }, 0);
}

const sizeKb = totalSize('dist') / 1024;
console.log(`Poids total du site : ${sizeKb.toFixed(1)} Ko (budget : ${BUDGET_KB} Ko)`);
if (sizeKb > BUDGET_KB) {
  console.error('Budget dépassé.');
  process.exit(1);
}
