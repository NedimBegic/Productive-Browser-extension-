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
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.shiftKey && event.key === "S") {
    console.log(
      "Content: Ctrl+Shift+S pressed. Sending message to background."
    );

    // Trigger the countdown
    chrome.runtime.sendMessage({ action: "startCountdown" });

    // Set the learning flag to true
    chrome.storage.local.set({ learning: true }, function () {
      console.log("Learning flag set to true");
    });
  }
});
