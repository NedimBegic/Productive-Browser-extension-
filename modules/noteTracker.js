export function saveNote() {
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");
  const notesContainer = document.getElementById("notesContainer");

  const title = titleInput.value;
  const content = contentInput.value;

  if (title && content) {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.innerHTML = `<strong>${title}:</strong> ${content}`;

    notesContainer.appendChild(noteDiv);

    // Clear input fields after saving the note
    titleInput.value = "";
    contentInput.value = "";
  }
}
