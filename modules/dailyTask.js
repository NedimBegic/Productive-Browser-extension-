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

// Event listener for the "Set Task" button
document.getElementById("setTaskBtn").addEventListener("click", function () {
  openTaskForm();
  closePopup();
});
