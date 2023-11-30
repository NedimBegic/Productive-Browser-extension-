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

      // Send a message to notify popup.js or other scripts about learning stopped
      chrome.runtime.sendMessage({ action: "learningStopped" });
    }

    // Set remainingLearning to zero
    chrome.storage.local.set(
      { remainingLearning: 0, learning: false },
      function () {
        // Log the value after it has been updated
        console.log("Remaining Learning time set to 0");
      }
    );
    showLearningEndMessage();
  }

  // Start learning
  if (event.ctrlKey && event.shiftKey && event.key === "S") {
    startLearning();

    // Send a message to notify popup.js or other scripts about learning started
    chrome.runtime.sendMessage({ action: "learningStarted" });
  }
});

function startLearning() {
  const learningMessage = document.createElement("div");
  const backgroundBlur = document.createElement("div");
  backgroundBlur.classList.add("backgroundBlur");
  learningMessage.innerText = "Learning started";
  learningMessage.classList.add("learningStarts");
  document.body.appendChild(backgroundBlur);
  document.body.appendChild(learningMessage);
  setTimeout(() => {
    document.body.removeChild(backgroundBlur);
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

        // Send a message to notify popup.js or other scripts about learning completed
        chrome.runtime.sendMessage({ action: "learningCompleted" });
      });
    } else {
      // Send a message to notify popup.js or other scripts about remainingLearning change
      chrome.runtime.sendMessage({
        action: "remainingLearningChanged",
        value: remainingLearning,
      });

      remainingLearning -= 1 / 60; // Decrement by one minute
    }
  }, 1000);
}

function showLearningEndMessage() {
  const learningEndMessage = document.createElement("div");
  const backgroundBlur = document.createElement("div");
  backgroundBlur.classList.add("backgroundBlur");
  learningEndMessage.innerText = "Learning ended";
  learningEndMessage.classList.add("learningEnds");
  document.body.appendChild(backgroundBlur);
  document.body.appendChild(learningEndMessage);
  setTimeout(() => {
    document.body.removeChild(backgroundBlur);
    document.body.removeChild(learningEndMessage);
  }, 3000);
}

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "forceBreak") {
    console.log("break is started");
    // Get break time from pomodoroTimer array in chrome.storage.local
    chrome.storage.local.get({ pomodoroTimer: [25, 5] }, function (result) {
      const breakTime = result.pomodoroTimer[1]; // Use the 1 index for break time

      // Set remainingLearning variable to breakTime
      chrome.storage.local.set(
        { remainingLearning: breakTime, learning: false },
        function () {
          // Log the value after it has been updated
          console.log("Remaining Learning time set to break time:", breakTime);
          startBreakCountdown(breakTime);
        }
      );

      // Show break started message
    });
  }
});

function startBreakCountdown(breakTime) {
  // Tell popup.js that the break is started
  chrome.runtime.sendMessage({ action: "breakBegining", breakTime: breakTime });

  const countdownContainer = document.createElement("div");
  countdownContainer.classList.add("breakCountdownContainer");
  // add motivation quotes
  const motivation = document.createElement("div");
  motivation.classList.add("motivation");

  const motivationQuotes = fetch("https://type.fit/api/quotes")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Choose a random quote from the array
      const randomIndex = Math.floor(Math.random() * data.length);
      const quote = data[randomIndex];

      // Create elements to display the quote and author
      const quoteElement = document.createElement("p");
      quoteElement.textContent = `"${quote.text}"`;
      quoteElement.classList.add("motivationQuote");

      const authorElement = document.createElement("p");
      authorElement.textContent = `- ${quote.author || "Unknown"}`;
      authorElement.classList.add("motivationAuthor");

      motivation.appendChild(quoteElement);
      motivation.appendChild(authorElement);

      // Append the motivation div to the document body
      document.body.appendChild(motivation);
    });

  // Create a div to display the break time
  const breakTimeDisplay = document.createElement("div");
  breakTimeDisplay.innerText = `Break Time: ${breakTime} minutes`;
  breakTimeDisplay.classList.add("breakTimeDisplay");
  countdownContainer.appendChild(breakTimeDisplay);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");

  const anotherCycleButton = document.createElement("button");
  anotherCycleButton.innerText = "Another Cycle";
  anotherCycleButton.classList.add("anotherCycleButton");
  anotherCycleButton.addEventListener("click", function () {
    // Handle Another Cycle button click
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      console.log("Learning stopped");
      chrome.runtime.sendMessage({ action: "learningStopped" });
    }

    chrome.storage.local.set(
      { remainingLearning: 0, learning: false },
      function () {
        console.log("Remaining Learning time set to 0");
        document.body.removeChild(countdownContainer);
        document.body.removeChild(backgroundBlur);
        document.body.removeChild(motivation);
        // Behave like ctrl+shift+s when Another Cycle is clicked
        startLearning();
      }
    );
  });
  buttonContainer.appendChild(anotherCycleButton);

  const stopLearningButton = document.createElement("button");
  stopLearningButton.innerText = "Stop Learning";
  stopLearningButton.classList.add("stopLearningButton");
  stopLearningButton.addEventListener("click", function () {
    // Handle Stop Learning button click
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      console.log("Learning stopped");
      chrome.runtime.sendMessage({ action: "learningStopped" });
    }

    chrome.storage.local.set(
      { remainingLearning: 0, learning: false },
      function () {
        console.log("Remaining Learning time set to 0");
        showLearningEndMessage();
        document.body.removeChild(countdownContainer);
        document.body.removeChild(backgroundBlur);
        document.body.removeChild(motivation);
      }
    );
  });
  // add backgroundBlur
  const backgroundBlur = document.createElement("div");
  backgroundBlur.classList.add("backgroundBlur");
  buttonContainer.appendChild(stopLearningButton);
  countdownContainer.appendChild(buttonContainer);

  // Append the countdownContainer to the document body
  document.body.appendChild(countdownContainer);
  document.body.appendChild(backgroundBlur);

  // Function to format time in MM:SS format
  function formatTime(time) {
    const minutes = Math.floor(time);
    const seconds = Math.round((time % 1) * 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  // close div after clicking on backgroundBlur
  backgroundBlur.addEventListener("click", () => {
    taskContainer.remove();
    backgroundBlur.remove();
  });
  // Start the countdown
  let remainingBreakTime = breakTime;
  const breakCountdownInterval = setInterval(function () {
    // Update the break time display
    breakTimeDisplay.innerText = `Break Time: ${formatTime(
      remainingBreakTime
    )}`;

    if (remainingBreakTime <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        console.log("Learning stopped");
        chrome.runtime.sendMessage({ action: "learningStopped" });
      }

      chrome.storage.local.set(
        { remainingLearning: 0, learning: false },
        function () {
          console.log("Remaining Learning time set to 0");
          document.body.removeChild(countdownContainer);
          document.body.removeChild(backgroundBlur);
          document.body.removeChild(motivation);
          // Behave like ctrl+shift+s when Another Cycle is clicked
          startLearning();
        }
      );
    } else {
      remainingBreakTime -= 1 / 60; // Decrement by one second
    }
  }, 1000);
}

/* ++++++++++++++++++ Daily tasks ++++++++++++++++++++++++++++++++ */
function createTaskForm() {
  // Create a div element
  const taskContainer = document.createElement("div");
  taskContainer.id = "task-container";

  // Set the inner HTML with the structure you described
  taskContainer.innerHTML = `
    <div id="task-header">Add today's task</div>
    <textarea id="task-input" placeholder="Write your task here..."></textarea>
    <div id="button-container">
      <button id="save-and-add">Save and add another</button>
      <button id="save">Save and close</button>
      <button id="cancel">Cancel</button>
    </div>
  `;
  const backgroundBlur = document.createElement("div");
  backgroundBlur.classList.add("backgroundBlur");
  // Append the container to the body
  document.body.appendChild(taskContainer);
  document.body.appendChild(backgroundBlur);

  // functnion for saving and opening the div again
  function saveTaskAndOpenNew() {
    const taskInput = taskContainer.querySelector("#task-input").value.trim();

    if (taskInput !== "") {
      chrome.storage.local.get({ dailyTasks: [] }, function (result) {
        const dailyTasks = result.dailyTasks;
        dailyTasks.push(taskInput);
        chrome.storage.local.set({ dailyTasks: dailyTasks }, function () {
          console.log("Task saved successfully!");
          alert("Task saved successfully!");
          // Open a new task container
          createTaskForm();
        });
      });
    } else {
      alert("Please enter a task before saving.");
    }
  }

  // close div after clicking on backgroundBlur
  backgroundBlur.addEventListener("click", () => {
    taskContainer.remove();
    backgroundBlur.remove();
  });
  // Add event listener to the "Cancel" button
  const cancelButton = taskContainer.querySelector("#cancel");
  cancelButton.addEventListener("click", () => {
    taskContainer.remove();
    backgroundBlur.remove();
  });
  // Add event listener to the "Save and add another" button
  const saveAndAddButton = taskContainer.querySelector("#save-and-add");
  saveAndAddButton.addEventListener("click", saveTaskAndOpenNew);

  // Add event listener to the "Save" button
  const saveButton = taskContainer.querySelector("#save");
  saveButton.addEventListener("click", () => {
    const taskInput = taskContainer.querySelector("#task-input").value.trim();

    if (taskInput !== "") {
      chrome.storage.local.get({ dailyTasks: [] }, function (result) {
        const dailyTasks = result.dailyTasks;
        dailyTasks.push(taskInput);

        // Save the updated array back to chrome.storage.local
        chrome.storage.local.set({ dailyTasks: dailyTasks }, function () {
          alert("Task saved successfully!");
        });

        // Remove the task container and background blur
        taskContainer.remove();
        backgroundBlur.remove();
      });
    } else {
      alert("Please enter a task before saving.");
    }
  });
}

// open Create Task if the browser is opened between start and end
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Handle messages here
  if (message.action === "renderDaily") {
    // Call your function to render the daily task form
    console.log("from background");
    createTaskForm();
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "openDaily") {
    // Call the createTaskForm function when receiving the "openDaily" message
    createTaskForm();
  }
});

// content.js

// This event is triggered when a message is received from the background script
document.addEventListener("DOMContentLoaded", function () {
  // Your function to be executed when the browser is opened
  createTaskForm();
  console.log("he");
});
