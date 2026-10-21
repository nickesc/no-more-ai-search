const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const contentScript = readFileSync(`${__dirname}/../src/content.js`, 'utf8');

function runContentScript({ heading = 'h2', aboveResults = false, overview = true, loaded = true } = {}) {
    const section = { style: {} };
    const aiHeading = {
        innerText: 'AI Overview',
        closest: selector => selector === (aboveResults ? 'div#rcnt > div' : 'div.ULSxyf') ? section : null,
    };
    const headings = [
        { selector: 'h2', element: { innerText: 'Web results' } },
        { selector: heading, element: aiHeading },
    ];
    const main = {
        querySelectorAll: selector => headings
            .filter(node => selector.split(',').map(part => part.trim()).includes(node.selector))
            .map(node => node.element),
    };
    let onMutation;
    runInNewContext(contentScript, {
        chrome: {
            storage: {
                sync: { get: (keys, callback) => callback({ overview }) },
                onChanged: { addListener() {} },
            },
        },
        document: {
            querySelector: selector => selector === 'div#rcnt' && loaded ? main : null,
            querySelectorAll: () => [],
        },
        MutationObserver: class {
            constructor(callback) { onMutation = callback; }
            observe() {}
        },
    });
    return { section, load: () => { loaded = true; onMutation(); } };
}

test('hides the current role heading above search results', () => {
    const { section } = runContentScript({ heading: '[role="heading"]', aboveResults: true });
    assert.equal(section.style.display, 'none');
});

test('still hides AI Overviews with native headings inside search results', () => {
    for (const heading of ['h1', 'h2']) {
        const { section } = runContentScript({ heading });
        assert.equal(section.style.display, 'none');
    }
});

test('waits for the results container and handles a later mutation', () => {
    const { section, load } = runContentScript({ loaded: false, heading: '[role="heading"]' });
    assert.equal(section.style.display, undefined);
    load();
    assert.equal(section.style.display, 'none');
});

test('respects the disabled Overview option', () => {
    const { section } = runContentScript({ overview: false, heading: '[role="heading"]' });
    assert.equal(section.style.display, undefined);
});
