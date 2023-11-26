document.addEventListener("DOMContentLoaded", function () {
  // Initial check and setup when the DOM is loaded
  chrome.storage.local.get(
    { pomodoroTime: [25, 5], remainingLearning: 0, learning: false },
    function (result) {
      const [studyTime, breakTime] = result.pomodoroTime;

      document.getElementById("studyTime").value = studyTime;
      document.getElementById("breakTime").value = breakTime;

      if (!result.learning) {
        document.getElementById("statusDisplay").textContent = "Inactive";
      } else {
        // Update statusDisplay every second
        setInterval(updateStatusDisplay, 1000);
      }
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

      chrome.storage.local.get({ remainingLearning: 0 }, function (result) {
        let remainingLearning = result.remainingLearning;

        const pomodoroTime = [studyTime, breakTime];
        chrome.storage.local.set(
          { pomodoroTime: pomodoroTime, remainingLearning: remainingLearning },
          function () {
            console.log("Pomodoro settings saved:", pomodoroTime);
          }
        );
      });
    });

  chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "updateStatus") {
      // Update statusDisplay based on the received message
      /* console.log("Received updateStatus message");
      updateStatusDisplay(); */
    } else if (message.action === "remainingLearningChanged") {
      // Update statusDisplay with the new remainingLearning value
      updateStatusDisplay(message.value);
    } else if (
      message.action === "learningCompleted" ||
      message.action === "learningStopped"
    ) {
      // Display "Inactive" in statusDisplay
      document.getElementById("statusDisplay").textContent = "Inactive";
    }
  });

  document
    .getElementById("forceBreakBtn")
    .addEventListener("click", function () {
      // Query for the currently active tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Send a message to the content script of the active tab
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: "forceBreak" });
        console.log("Message sent to content script of the active tab");

        // Get break time from pomodoroTimer array in chrome.storage.local
        chrome.storage.local.get({ pomodoroTimer: [25, 5] }, function (result) {
          const breakTime = result.pomodoroTimer[1]; // Use the 1 index for break time

          // Set remainingLearning to break time
          chrome.storage.local.set(
            { remainingLearning: breakTime },
            function () {
              console.log(
                "Remaining Learning time set to break time:",
                breakTime
              );
              chrome.extension
                .getBackgroundPage()
                .chrome.extension.getViews({ type: "popup" })[0]
                .close();
            }
          );
        });
      });
    });
});

function updateStatusDisplay(remainingLearning) {
  // Check if remainingLearning is a valid number
  if (
    !isNaN(remainingLearning) &&
    isFinite(remainingLearning) &&
    remainingLearning >= 0
  ) {
    // Convert remainingLearning to minutes and seconds
    const minutes = Math.floor(remainingLearning);
    const seconds = Math.round((remainingLearning % 1) * 60);

    // Format the time as MM:SS
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    console.log(formattedTime);

    // Update the content of the statusDisplay element
    const statusDisplay = document.getElementById("statusDisplay");
    statusDisplay.textContent = formattedTime;
  } else {
    console.log("Invalid remainingLearning value:", remainingLearning);
  }
}
