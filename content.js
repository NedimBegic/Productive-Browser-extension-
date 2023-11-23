/* +++++++++++++++++++ FOR NOTES +++++++++++++++++++++++++++++++ */
let textarea;
document.addEventListener("keydown", function (event) {
  // to display textarea
  if (event.ctrlKey && event.shiftKey && event.key === "X") {
    // Create a new textarea
    textarea = document.createElement("textarea");
    textarea.rows = 4;
    textarea.cols = 50;
    textarea.classList.add("textarea-container");
    document.body.appendChild(textarea);
    textarea.focus();
  }

  // hide and update popup.html with notes
  if (event.ctrlKey && event.shiftKey && event.key === "Y") {
    console.log("it works");
    // store info from textarea into chrome.storage.local
    if (textarea && textarea.value.trim() !== "") {
      // Send textarea.value to background.js
      chrome.runtime.sendMessage({
        action: "updateNotes",
        notes: textarea.value,
      });
    }
    textarea.remove();
    textarea = null;
  }
});

/* ++++++++++++++++++++++++ FOR POMORODO +++++++++++++++++++++++++++++ */
// content.js

let countdownInterval; // Variable to store the interval ID

document.addEventListener("keydown", function (event) {
  // Stop learning
  if (event.ctrlKey && event.shiftKey && event.key === "E") {
    // Clear the countdownInterval if it exists
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      console.log("Learning stopped");
    }

    // Set remainingLearning to zero
    chrome.storage.local.set(
      { remainingLearning: 0, learning: false },
      function () {
        // Log the value after it has been updated
        console.log("Remaining Learning time set to 0");
      }
    );
  }

  // Start learning
  if (event.ctrlKey && event.shiftKey && event.key === "S") {
    startLearning();
  }
});

function startLearning() {
  // Display "Learning started" at the center of the current HTML document for 3 seconds
  const learningMessage = document.createElement("div");
  learningMessage.innerText = "Learning started";
  learningMessage.style.position = "fixed";
  learningMessage.style.top = "50%";
  learningMessage.style.left = "50%";
  learningMessage.style.transform = "translate(-50%, -50%)";
  learningMessage.style.background = "#fff";
  learningMessage.style.padding = "10px";
  learningMessage.style.border = "1px solid #ccc";
  learningMessage.style.borderRadius = "5px";
  document.body.appendChild(learningMessage);

  setTimeout(() => {
    document.body.removeChild(learningMessage);
  }, 3000);

  // Set remainingLearning variable in chrome.storage.local
  chrome.storage.local.get({ pomodoroTime: [25, 5] }, function (result) {
    const remainingLearning = result.pomodoroTime[0];
    chrome.storage.local.set(
      { remainingLearning: remainingLearning, learning: true },
      function () {
        // Log the value after it has been updated
        console.log("Remaining Learning time set:", remainingLearning);
      }
    );

    // Start countdown
    startCountdown(remainingLearning);
  });
}

function startCountdown(remainingLearning) {
  countdownInterval = setInterval(function () {
    const minutes = Math.floor(remainingLearning);
    const seconds = Math.round((remainingLearning % 1) * 60); // Round seconds

    if (remainingLearning <= 0) {
      clearInterval(countdownInterval);
      // Optionally reset remainingLearning after the countdown
      chrome.storage.local.set({ remainingLearning: 0 }, function () {
        console.log("Remaining Learning time reset to 0");
      });
    } else {
      console.log(remainingLearning);
      remainingLearning -= 1 / 60; // Decrement by one minute
    }
  }, 1000);
}
