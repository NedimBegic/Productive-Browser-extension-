document.addEventListener("DOMContentLoaded", function () {
  // Initial check and setup when the DOM is loaded
  chrome.storage.local.get(
    { pomodoroTime: [25, 5], remainingLearning: 0 },
    function (result) {
      const [studyTime, breakTime] = result.pomodoroTime;

      document.getElementById("studyTime").value = studyTime;
      document.getElementById("breakTime").value = breakTime;
    }
  );

  // Click event listener for saving changes
  document
    .getElementById("saveChangesBtn")
    .addEventListener("click", function () {
      const studyTime = parseInt(
        document.getElementById("studyTime").value,
        10
      );
      const breakTime = parseInt(
        document.getElementById("breakTime").value,
        10
      );

      const pomodoroTime = [studyTime, breakTime];
      chrome.storage.local.set(
        { pomodoroTime: pomodoroTime, remainingLearning: 0 },
        function () {
          console.log("Pomodoro settings saved:", pomodoroTime);
        }
      );
    });

  // Update statusDisplay every second
  setInterval(updateStatusDisplay, 1000);
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "updateStatus") {
    // Update statusDisplay based on the received message
    updateStatusDisplay();
  }
});

function updateStatusDisplay() {
  // Get remainingLearning from chrome.storage.local
  chrome.storage.local.get({ remainingLearning: 0 }, function (result) {
    const remainingLearning = result.remainingLearning;

    const statusDisplay = document.getElementById("statusDisplay");
    statusDisplay.textContent = remainingLearning;
  });
}
