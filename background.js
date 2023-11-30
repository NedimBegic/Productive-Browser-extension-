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

/* ++++++++++++++ Daily Task +++++++++++++++++++++++++++++ */

// updating start and end
// Declare a variable to store data
var sharedData = {};

// Listen for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Handle messages here
  if (message.action === "updateTimeDaily") {
    // Update shared data based on the updated time settings
    sharedData.startTaskTime = message.start;
    sharedData.endTaskTime = message.end;

    // Update chrome.storage.local with the new values
    chrome.storage.local.set(
      {
        rangeDaily: {
          start: sharedData.startTaskTime,
          end: sharedData.endTaskTime,
        },
      },
      function () {
        console.log("Daily task range updated in storage.");
      }
    );

    // Optionally, trigger any other actions based on the updated time settings
    checkAndRenderDailyContent();
  }
});

// Listen for the extension being started
chrome.runtime.onStartup.addListener(function () {
  updateSharedDataAndRenderContent();
});

// Function to update shared data based on time settings and render content
function updateSharedDataAndRenderContent() {
  updateSharedData(function () {
    checkAndRenderDailyContent();
  });
}

// Function to update shared data based on time settings
function updateSharedData(callback) {
  chrome.storage.local.get(["rangeDaily", "openedDaily"], function (result) {
    var startTaskTime = result.rangeDaily?.start || "08:00";
    var endTaskTime = result.rangeDaily?.end || "10:00";
    var openedDaily = result.openedDaily || false;

    // Set the shared data with the updated time settings
    sharedData.startTaskTime = startTaskTime;
    sharedData.endTaskTime = endTaskTime;
    sharedData.openedDaily = openedDaily;

    // Call the callback function to signal that updateSharedData has completed
    if (typeof callback === "function") {
      callback();
    }
  });
}

// Function to check the current time and render content if within the specified range
function checkAndRenderDailyContent() {
  var currentTime = new Date();
  var currentHours = currentTime.getHours();

  // Check if the current time is within the specified range and openedDaily is false
  if (
    currentHours >= sharedData.startTaskTime &&
    currentHours < sharedData.endTaskTime &&
    !sharedData.openedDaily
  ) {
    sendMessageToContentScripts({ action: "renderDaily" });

    // Update openedDaily to true to indicate that the extension has been opened today
    chrome.storage.local.set({ openedDaily: true });
  }
}

// Function to send a message to content scripts
function sendMessageToContentScripts(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

// for practice
// background
