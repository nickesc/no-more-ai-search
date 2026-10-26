const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { createContext, runInContext } = require('node:vm');

const contentScript = readFileSync(`${__dirname}/../src/content.js`, 'utf8');
const userscript = readFileSync(`${__dirname}/../src/userscript.js`, 'utf8');

function runContentScript({ heading = 'h2', text = 'AI Overview', marker, container = 'rcnt', aboveResults = false, resultWrapper = 'div.ULSxyf', overview = true, loaded = true } = {}) {
    const section = { style: {} };
    const aiHeading = {
        innerText: text,
        closest: selector => selector.split(',').map(part => part.trim())
            .includes(aboveResults ? `div#${container} > div` : resultWrapper) ? section : null,
    };
    const headings = [
        { selector: 'h2', element: { innerText: 'Web results' } },
        { selector: heading, element: aiHeading },
    ];
    const main = {
        querySelector: selector => marker && selector.split(',').map(part => part.trim()).includes(marker) ? aiHeading : null,
        querySelectorAll: selector => headings
            .filter(node => selector.split(',').map(part => part.trim()).includes(node.selector))
            .map(node => node.element),
    };
    let onMutation;
    const context = createContext({
        document: {
            querySelector: selector => selector === `div#${container}` && loaded ? main : null,
            querySelectorAll: () => [],
        },
        MutationObserver: class {
            constructor(callback) { onMutation = callback; }
            observe() {}
        },
    });
    runInContext(userscript, context);
    runInContext('options', context).overview = overview;
    runInContext(contentScript, context);
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
    for (const marker of [undefined, '[data-async-type="folsrch"]', '[id^="folsrch"]']) {
        const { section } = runContentScript({ overview: false, heading: '[role="heading"]', marker });
        assert.equal(section.style.display, undefined);
    }
});

test('hides AI markers before headings appear on desktop and mobile', () => {
    for (const container of ['rcnt', 'center_col']) {
        for (const marker of ['[data-async-type="folsrch"]', '[id^="folsrch"]']) {
            const { section } = runContentScript({ heading: null, marker, container, aboveResults: true });
            assert.equal(section.style.display, 'none');
        }
    }
});

test('keeps the heading fallback on mobile without early markers', () => {
    const { section } = runContentScript({ heading: '[role="heading"]', container: 'center_col', aboveResults: true });
    assert.equal(section.style.display, 'none');
});

test('recognizes French and Danish headings', () => {
    for (const text of ['Aperçu IA', 'AI-oversigt']) {
        const { section } = runContentScript({ text, heading: '[role="heading"]' });
        assert.equal(section.style.display, 'none');
    }
});

test('hides the individual result when an early marker has no ULSxyf wrapper', () => {
    const { section } = runContentScript({ heading: null, marker: '[data-async-type="folsrch"]', resultWrapper: 'div#rso > div' });
    assert.equal(section.style.display, 'none');
});

test('leaves ordinary headings alone', () => {
    const { section } = runContentScript({ text: 'Swimming lessons', heading: '[role="heading"]' });
    assert.equal(section.style.display, undefined);
});
