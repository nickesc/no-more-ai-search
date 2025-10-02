const browserApi = chrome ? chrome : browser;

function unsetOptions(e) {
    e.preventDefault();
    browserApi.storage.sync.remove("enabled");
    browserApi.storage.sync.remove("overview");
    browserApi.storage.sync.remove("docs");
    console.log("unsetting settings");
}

function saveOptions(e) {
    e.preventDefault();
    let options = {
        enabled: document.querySelector("#enabled").checked,
        overview: document.querySelector("#overview").checked,
        docs: document.querySelector("#docs").checked,
    }

    browserApi.storage.sync.set(options);
}

function restoreOptions() {

    function setOptionChoices(result) {
        if (result.enabled == true || result.enabled == false) {
            document.querySelector("#enabled").checked = result.enabled;
            console.log("loaded enabled choice successfully");
        } else {
            document.querySelector("#enabled").checked = true;
            console.log("failed to load enabled choice");
        }

        if (result.overview == true || result.overview == false) {
            document.querySelector("#overview").checked = result.overview;
            console.log("loaded overview choice successfully");
        } else {
            document.querySelector("#overview").checked = true;
            console.log("failed to load overview choice");
        }

        if (result.docs == true || result.docs == false) {
            document.querySelector("#docs").checked = result.docs;
            console.log("loaded docs choice successfully");
        } else {
            document.querySelector("#docs").checked = true;
            console.log("failed to load docs choice");
        }
    }

    browserApi.storage.sync.get(["enabled", "overview", "docs"],  ({ enabled, overview, docs }) => {
        setOptionChoices({ enabled, overview, docs });
    });
}


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("form").addEventListener("reset", unsetOptions);
