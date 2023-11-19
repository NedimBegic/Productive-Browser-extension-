/* +++++++++++++++++++++++++++ Making note tracker ++++++++++++++++++++++++++++++ */
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
    // store info from textarea into local storage
    if (textarea && textarea.value.trim() !== "") {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes.push(textarea.value);
      localStorage.setItem("notes", JSON.stringify(notes));
    }
    textarea.remove();
    textarea = null;
  }
});
