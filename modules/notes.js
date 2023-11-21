/* ++++++++++++++++++++++ COPING THE NOTES AND DISPLAY TEXT TO INFORM +++++++++++++++++++ */
document
  .getElementById("notesList")
  .addEventListener("click", function (event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === "DIV") {
      // Copy text to clipboard
      const textToCopy = clickedElement.textContent;
      navigator.clipboard.writeText(textToCopy).then(function () {
        // Show the textCopy div near the cursor
        const textCopy = document.querySelector(".textCopy");

        // Set the position of the textCopy div based on the cursor coordinates
        textCopy.style.left = event.pageX + 10 + "px";
        textCopy.style.top = event.pageY + "px";

        // Display the textCopy div
        textCopy.style.display = "block";

        // Hide the textCopy div after 0.3 seconds
        setTimeout(function () {
          textCopy.style.display = "none";
        }, 1000);
      });
    }
  });
