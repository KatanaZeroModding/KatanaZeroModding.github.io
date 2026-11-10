import { readFile, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] || resolve(root, '../references/room_bar_vanilla'));
// Read provenance before copying: the website uses NULL from the original game.
const manifest = JSON.parse(await readFile(resolve(source, 'manifest.json'), 'utf8'));
if (!manifest.source) {
  throw new Error('Expected an original Katana ZERO export with manifest.source set.');
}
const sprites = JSON.parse(await readFile(resolve(source, 'sprites.json'), 'utf8'));
const names = [
  'bg_bar', 'spr_player_sitstool_idle', 'spr_player_drink', 'spr_bartender_idle',
  'spr_vet1_shirt_right_idle', 'spr_vet1_shirt_talk',
  'spr_vet2_cap_idle', 'spr_vet2_cap_talk', 'spr_vet2_cap_smoke', 'spr_bar_glass',
  'spr_cigarette_smoke'
];
const selected = {};
await mkdir(resolve(root, 'static/bar'), { recursive: true });
// The site intentionally omits the separate lantern layer.
await rm(resolve(root, 'static/bar/spr_lantern.png'), { force: true });
await rm(resolve(root, 'static/bar/spr_player_drunk_idle.png'), { force: true });
await mkdir(resolve(root, 'src/lib'), { recursive: true });
for (const name of names) {
  const sprite = sprites[name];
  if (!sprite) throw new Error(`Missing sprite: ${name}`);
  await copyFile(resolve(source, sprite.strip), resolve(root, `static/bar/${name}.png`));
  const { width, height, originX, originY, frames, fps } = sprite;
  selected[name] = { width, height, originX, originY, frames, fps, src: `/bar/${name}.png` };
}
await writeFile(resolve(root, 'src/lib/bar-sprites.json'), `${JSON.stringify(selected, null, 2)}\n`);
console.log(`Imported ${names.length} ambient scene sprites from ${source}`);
