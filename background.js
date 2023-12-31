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

/* ++++++++++++++++++++++ POMORODO TIMER +++++++++++++++++++++++++++++++++ */

// Function to start the countdown
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startCountdown") {
    console.log("Background: Received message from content script");

    // Set the learning flag to true
    chrome.storage.local.set({ learning: true }, function () {
      console.log("Learning flag set to true");
    });
  }
});

// background.js

let learningCountdown;
let countdownInterval;

function startLearningCountdown(studyTime) {
  learningCountdown = studyTime;
  countdownInterval = setInterval(function () {
    chrome.storage.local.set({ learningCountdown: learningCountdown });

    if (learningCountdown <= 0) {
      clearInterval(countdownInterval);
      // Additional actions when countdown reaches zero can be added here
    } else {
      learningCountdown--;
    }
  }, 1000);
}

// Listen for Ctrl+Shift+S key combination to start the countdown
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.shiftKey && event.key === "S") {
    console.log(
      "Background: Ctrl+Shift+S pressed. Starting learning countdown."
    );

    // Load settings from chrome.storage.local
    chrome.storage.local.get({ pomodoroTime: [25, 5] }, function (result) {
      const [studyTime] = result.pomodoroTime;

      // Start the learning countdown with studyTime
      startLearningCountdown(studyTime);
    });
  }
});

// Listen for popup.js requesting the learningCountdown value
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "popup") {
    port.onMessage.addListener(function (msg) {
      if (msg.action === "getLearningCountdown") {
        port.postMessage({ learningCountdown: learningCountdown });
      }
    });
  }
});
