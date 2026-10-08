import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { distroIds } from '../src/domain/distro.ts';

test('every roster profile has one transparent 512px PNG character asset', () => {
  const directory = new URL('../public/characters/', import.meta.url);
  assert.deepEqual(
    readdirSync(directory).sort(),
    distroIds.map((id) => `${id}.png`).sort(),
  );
  for (const id of distroIds) {
    const png = readFileSync(new URL(`${id}.png`, directory));
    assert.deepEqual(
      png.subarray(0, 8),
      Buffer.from('89504e470d0a1a0a', 'hex'),
    );
    assert.equal(png.toString('ascii', 12, 16), 'IHDR');
    assert.equal(png.readUInt32BE(16), 512, id);
    assert.equal(png.readUInt32BE(20), 512, id);
    assert.equal(png[25], 6, `${id} must retain RGBA transparency support`);
  }
});
