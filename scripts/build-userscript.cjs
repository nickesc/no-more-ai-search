const { readFileSync, mkdirSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const root = resolve(__dirname, '..');
const manifest = JSON.parse(readFileSync(resolve(root, 'manifest.json'), 'utf8'));
const setup = readFileSync(resolve(root, 'src/userscript.js'), 'utf8');
const content = readFileSync(resolve(root, 'src/content.js'), 'utf8');
const releaseUrl = `${manifest.homepage_url}/releases/latest/download`;
const header = [
    '// ==UserScript==',
    `// @name         ${manifest.name}`,
    `// @namespace    ${manifest.homepage_url}`,
    `// @version      ${manifest.version}`,
    `// @updateURL    ${releaseUrl}/no-more-ai-search.user.js`,
    `// @downloadURL  ${releaseUrl}/no-more-ai-search.user.js`,
    `// @description  ${manifest.description}`,
    `// @author       ${manifest.author}`,
    '// @license      MIT',
    ...manifest.content_scripts[0].matches.map(match => `// @match        ${match}`),
    '// @run-at       document-start',
    '// @inject-into  content',
    '// @grant        none',
    '// @noframes',
    '// ==/UserScript==',
];

const script = `${header.join('\n')}\n\n(() => {\n'use strict';\n\n${setup}\n${content}\n})();\n`;
mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/no-more-ai-search.user.js'), script);
console.log('Built dist/no-more-ai-search.user.js');
