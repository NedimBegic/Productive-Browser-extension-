function openNightReview() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "openNight" });
  });
}

// Function to close the popup
function closePopup() {
  window.close();
}

document
  .getElementById("startReviewBtn")
  .addEventListener("click", function () {
    openNightReview();
    closePopup();
  });
