/* +++++++++++++++++++++++++  FOR TRACKING NOTES ++++++++++++++++++++++++++ */

let backgroundNotes = "";
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

    // Retrieve existing notes array from chrome.storage.local and add the new note
    chrome.storage.local.get({ allNotes: [] }, function (result) {
      let allNotes = result.allNotes;

      // Add the new note to the array
      allNotes.push(request.notes);

      // Store the updated notes array back in chrome.storage.local
      chrome.storage.local.set({ allNotes: allNotes }, function () {
        console.log("All notes stored in chrome.storage.local:", allNotes);
      });
    });
  }
});

// Example: Retrieve notes from chrome.storage.local and log them (optional)
chrome.storage.local.get("notes", function (result) {
  const storedNotes = result.notes;
  console.log("Notes retrieved from chrome.storage.local:", storedNotes);
});
