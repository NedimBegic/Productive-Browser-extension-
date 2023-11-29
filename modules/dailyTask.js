// Function to open the task form
function openTaskForm() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "openDaily" });
  });
}

// Function to close the popup
function closePopup() {
  chrome.extension
    .getBackgroundPage()
    .chrome.extension.getViews({ type: "popup" })[0]
    .close();
}

// Function to save daily task range to chrome.storage.local
function saveDailyTaskRange() {
  const startTaskTime = document.getElementById("startTaskInput").value;
  const endTaskTime = document.getElementById("endTaskInput").value;

  // Save the time range to local storage
  chrome.storage.local.set(
    { rangeDaily: { start: startTaskTime, end: endTaskTime } },
    function () {
      console.log("Daily task range saved successfully!");
      alert("Daily task range saved successfully!");

      // Send a message to the background script to update time settings
      chrome.runtime.sendMessage({
        action: "updateTimeDaily",
        start: startTaskTime,
        end: endTaskTime,
      });
    }
  );
}

// Event listener for the "Set Task" button
document.getElementById("setTaskBtn").addEventListener("click", function () {
  openTaskForm();
  closePopup();
});

// Event listener for the "Save Daily Task" button
document
  .getElementById("saveDailyTaskBtn")
  .addEventListener("click", function () {
    saveDailyTaskRange();
  });
