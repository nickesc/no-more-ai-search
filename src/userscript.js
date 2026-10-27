// Set a feature to false to keep it visible, then save and reload the page.
const options = {
    enabled: true, // Hide AI Mode buttons
    overview: true, // Hide AI Overviews
    docs: true, // Hide the AI button in Docs
};

function getOptions(callback) {
    callback(options);
}
