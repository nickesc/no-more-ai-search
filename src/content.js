const patterns = [
    /übersicht mit ki/i, // de
    /ai overview/i, // en
    /prezentare generală generată de ai/i, // ro
    /AI による概要/, // ja
    /Обзор от ИИ/, // ru
    /AI 摘要/, // zh-TW
    /AI-overzicht/i, // nl
    /AI-oversigt/i, // da
    /Vista creada con IA/i, // es
    /Přehled od AI/i, // cz
    /Aperçu IA/i, // fr
];

function removeAISections() {
    getOptions(({ enabled, overview, docs }) => {
        if (enabled === true || enabled === undefined) {
            const searchButtons = document.querySelectorAll('.olrp5b, .plR5qb');
            searchButtons.forEach(element => element.style.display = "none");
        }

        if (docs === true || docs === undefined) {
            const docsSidekick = document.querySelectorAll('#docs-sidekick-gen-ai-promo-button-container');
            docsSidekick.forEach(element => element.style.display = "none");
        }

        if (overview === true || overview === undefined) {
            // each time there's a mutation in the document see if there's an ai overview to hide
            const mainBody = document.querySelector('div#rcnt') || document.querySelector('div#center_col');
            const aiContent = mainBody?.querySelector('[data-async-type="folsrch"], [id^="folsrch"]')
                || [...(mainBody?.querySelectorAll('h1, h2, [role="heading"]') ?? [])].find(e => patterns.some(pattern => pattern.test(e.innerText)));

            let aiOverview = aiContent?.closest('div.ULSxyf'); // AI overview as a search result
            if (!aiOverview) aiOverview = aiContent?.closest('div#rso > div, div#rcnt > div, div#center_col > div');

            // Hide AI overview
            if (aiOverview) aiOverview.style.display = "none";

            // Restore padding after header tabs
            const headerTabs = document.querySelector('div#hdtb-sc > div');
            if (headerTabs) headerTabs.style.paddingBottom = "12px";

            const mainElement = document.querySelector('[role="main"]');
            if (mainElement) {
                mainElement.style.marginTop = "12px";
            }

            // Remove entries in "People also ask" section if it contains "AI overview"
            const peopleAlsoAskAiOverviews = [
                ...document.querySelectorAll("div.related-question-pair"),
            ].filter((el) => patterns.some((pattern) => pattern.test(el.innerHTML)));

            peopleAlsoAskAiOverviews.forEach((el) => {
                el.parentElement.parentElement.style.display = "none";
            });
        }
    });
}

const observer = new MutationObserver(() => {
    removeAISections();
});

observer.observe(document, {
    childList: true,
    subtree: true,
});

removeAISections();
