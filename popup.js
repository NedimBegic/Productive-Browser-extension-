// Add a listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve all notes from chrome.storage.local
  chrome.storage.local.get({ allNotes: [] }, function (result) {
    const allNotes = result.allNotes;

    // Update the UI with the received data
    updateUI(allNotes);
  });
});
// Add a listener for messages from background.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateNotes") {
    // Retrieve all notes from chrome.storage.local
    chrome.storage.local.get({ allNotes: [] }, function (result) {
      const allNotes = result.allNotes;

      // Add the new note to the array
      allNotes.push(request.notes);

      // Store the updated notes array back in chrome.storage.local
      chrome.storage.local.set({ allNotes: allNotes }, function () {
        console.log("All notes stored in chrome.storage.local:", allNotes);

        // Update the UI with the received data
        updateUI(allNotes);
      });
    });
  }
});

// Function to update the UI with the received data
function updateUI(allNotes) {
  // Update your popup.html UI with the received notes
  const notesList = document.getElementById("notesList");

  // Clear previous content
  notesList.innerHTML = "";

  // Iterate through all notes and create <li> elements
  allNotes.forEach(function (note) {
    const liElement = document.createElement("li");
    liElement.textContent = note;
    notesList.appendChild(liElement);
  });
}
