// Add a listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve all notes from chrome.storage.local
  chrome.storage.local.get({ allNotes: [] }, function (result) {
    const allNotes = result.allNotes;

    // Update the UI with the received data
    updateUI(allNotes);
  });

  /* // Set up the interval to clear storage at midnight
  clearStorageAtMidnight(); */
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
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  // Iterate through all notes and create <div> elements with a <li> and a remove button
  allNotes.forEach(function (note, index) {
    const noteDiv = document.createElement("div");

    // Create <li> element for the note
    const liElement = document.createElement("li");
    liElement.textContent = note;

    // Create remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
      // Call a function to handle note removal when the button is clicked
      removeNote(index);
    });

    // Append the <li> and remove button to the <div>
    noteDiv.appendChild(liElement);
    noteDiv.appendChild(removeButton);

    // Append the <div> to the notesList
    notesList.appendChild(noteDiv);
  });
}

// Function to handle note removal
function removeNote(index) {
  // Retrieve all notes from chrome.storage.local
  chrome.storage.local.get({ allNotes: [] }, function (result) {
    const allNotes = result.allNotes;

    // Remove the note at the specified index
    allNotes.splice(index, 1);

    // Store the updated notes array back in chrome.storage.local
    chrome.storage.local.set({ allNotes: allNotes }, function () {
      console.log("All notes stored in chrome.storage.local:", allNotes);

      // Update the UI with the updated data
      updateUI(allNotes);
    });
  });
}

// Function to clear chrome.storage.local at midnight
function clearStorageAtMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // Set time to 00:00:00

  const timeUntilMidnight = midnight - now;

  // Set an interval to clear storage when the clock reaches 00:00
  setTimeout(function () {
    chrome.storage.local.clear(function () {
      console.log("chrome.storage.local cleared at midnight.");
    });
  }, timeUntilMidnight);
}
