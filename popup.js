// Add a listener for messages from content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateNotes") {
    // Log the received notes to the console
    console.log("Received notes in popup.js:", request.notes);

    // You can do further processing with the received notes here
    // For example, update the UI of your popup.html
  }
});
