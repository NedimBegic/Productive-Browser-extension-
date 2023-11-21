// popup.js

document.addEventListener("DOMContentLoaded", function () {
  // Load settings, learning flag, and remainingLearning from chrome.storage.local on popup open
  chrome.storage.local.get(
    { pomodoroTime: [25, 5], learning: false, remainingLearning: 0 },
    function (result) {
      const [studyTime, breakTime] = result.pomodoroTime;

      // Set input values based on loaded settings
      document.getElementById("studyTime").value = studyTime;
      document.getElementById("breakTime").value = breakTime;

      // Check if learning flag is true
      if (result.learning) {
        // Set remainingLearning to the first element of pomodoroTime array
        const remainingLearning = result.remainingLearning || studyTime;
        console.log(remainingLearning);
        // Start the countdown with remainingLearning
        startCountdown(remainingLearning);
      }
    }
  );

  // Save changes when the "Save Changes" button is clicked
  document
    .getElementById("saveChangesBtn")
    .addEventListener("click", function () {
      // Get values from input fields
      const studyTime = parseInt(
        document.getElementById("studyTime").value,
        10
      );
      const breakTime = parseInt(
        document.getElementById("breakTime").value,
        10
      );

      // Update the array and save it to chrome.storage.local
      const pomodoroTime = [studyTime, breakTime];
      chrome.storage.local.set(
        { pomodoroTime: pomodoroTime, learning: false, remainingLearning: 0 },
        function () {
          console.log("Pomodoro settings saved:", pomodoroTime);
        }
      );
    });
});

// Function to start the countdown
function startCountdown(remainingLearning) {
  // Convert remainingLearning to seconds
  let totalSeconds = remainingLearning * 60;

  // Update the statusDisplay span with the initial value
  updateStatusDisplay(remainingLearning);

  // Create an interval to decrease the countdown every second
  const countdownInterval = setInterval(function () {
    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Update remainingLearning in chrome.storage.local
    chrome.storage.local.set({ remainingLearning: totalSeconds / 60 });

    // Update the statusDisplay span with the current countdown
    updateStatusDisplay(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);

    // Decrease totalSeconds by 1
    totalSeconds--;

    // Check if the countdown has reached zero
    if (totalSeconds < 0) {
      // Clear the interval and perform any additional actions
      clearInterval(countdownInterval);
      // Additional actions when countdown reaches zero can be added here
    }
  }, 1000); // Update every 1000 milliseconds (1 second)
}

function updateStatusDisplay(value) {
  // Update the statusDisplay span with the provided value
  document.getElementById("statusDisplay").innerText = value;
}
