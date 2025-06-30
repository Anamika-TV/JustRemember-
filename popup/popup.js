const messageBox = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");

function getDomain(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}

let currentDomain = null;

// Step 1: Get the current tab's domain
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    currentDomain = getDomain(tab.url);
    
    // Step 2: Load the saved message for this domain
    chrome.storage.local.get("notes", (result) => {
        const notes = result.notes || {};
        messageBox.value = notes[currentDomain] || "";
    });
});

// Step 3: Save the message when button is clicked
saveBtn.addEventListener("click", () => {
    const message = messageBox.value;

    chrome.storage.local.get("notes", (result) => {
        const notes = result.notes || {};
        notes[currentDomain] = message;

        chrome.storage.local.set({ notes }, () => {
            alert("Note saved for " + currentDomain);
        });
    });
});
