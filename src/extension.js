const browserApi = typeof chrome !== "undefined" ? chrome : browser;

function getOptions(callback) {
    browserApi.storage.sync.get(["enabled", "overview", "docs"], callback);
}

browserApi.storage.onChanged.addListener(() => {
    removeAISections();
});
