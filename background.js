// Background script to handle messages from content.js and popup.js

let backgroundNotes = ""; // Variable to store notes received from content.js

// Add a listener for messages from content.js and popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateNotes") {
    // Update the backgroundNotes variable with the received notes
    backgroundNotes = request.notes;

    // Log the received notes to the console (optional)
    console.log("Received notes in background.js:", backgroundNotes);

    // Store the notes in chrome.storage.local
    chrome.storage.local.set({ notes: backgroundNotes }, function () {
      console.log("Notes stored in chrome.storage.local");
    });
  }
});

// Example: Retrieve notes from chrome.storage.local and log them (optional)
chrome.storage.local.get("notes", function (result) {
  const storedNotes = result.notes;
  console.log("Notes retrieved from chrome.storage.local:", storedNotes);
});
