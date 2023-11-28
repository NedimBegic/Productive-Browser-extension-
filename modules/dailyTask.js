// render the add task html part
document.getElementById("setTaskBtn").addEventListener("click", function () {
  // Send a message to content.js to create the task form
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "createTaskForm" });
  });
  chrome.extension
    .getBackgroundPage()
    .chrome.extension.getViews({ type: "popup" })[0]
    .close();
});
