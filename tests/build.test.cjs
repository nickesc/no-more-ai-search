const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { Script } = require('node:vm');

const manifest = JSON.parse(readFileSync(`${__dirname}/../manifest.json`, 'utf8'));
execFileSync(process.execPath, [`${__dirname}/../scripts/build-userscript.cjs`]);
const userscript = readFileSync(`${__dirname}/../dist/no-more-ai-search.user.js`, 'utf8');

test('userscript metadata follows the extension version and domains', () => {
    assert.equal(userscript.match(/^\/\/ @version\s+(.+)$/m)[1], manifest.version);
    assert.deepEqual([...userscript.matchAll(/^\/\/ @match\s+(.+)$/gm)].map(match => match[1]), manifest.content_scripts[0].matches);
});

test('userscript build includes the settings and shared logic as valid JavaScript', () => {
    for (const source of ['src/userscript.js', 'src/content.js']) {
        assert.ok(userscript.includes(readFileSync(`${__dirname}/../${source}`, 'utf8')), `Missing ${source}`);
    }
    assert.doesNotThrow(() => new Script(userscript));
});
