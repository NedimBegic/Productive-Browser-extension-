# Productive Browser - CS50 Final Project

Welcome to the Productive Browser, a JavaScript extension developed as the final project for the Computer Science Introduction course at Harvard University (CS50). This extension is designed to boost productivity with its four key functionalities: Taking Notes, Pomodoro Learning, Daily Tasks, and Night Review.

## YouTube Presentation

Watch a [YouTube presentation](https://www.youtube.com/watch?v=01PiYmBNUJc&t=29s&ab_channel=NedimBegic) for a visual overview of the Productive Browser extension.

## Functionalities

### Taking Notes

**Explanation and Instructions:**
Taking effective notes is a crucial aspect of learning. With the Productive Browser extension, you can seamlessly take notes while studying. Simply press `Ctrl+Shift+X` to open a textbox, enter your notes, and save/close the textbox with `Ctrl+Shift+Y`. To enhance user experience, notes can be copied by clicking on them, and unwanted notes can be deleted. All your notes are securely saved using `chrome.storage.local`, ensuring that your valuable information is accessible whenever you need it.

![Notes](https://i.ibb.co/nf7BJxS/notes.png)

### Pomodoro

**Explanation and Instructions:**
The Pomodoro Technique is a proven method for enhancing concentration and productivity through focused study sessions and short breaks. The Productive Browser extension allows you to customize your learning time and break duration in the popup settings. Initiate a learning session with `Ctrl+Shift+S` and conclude it with `Ctrl+Shift+E`. If you need a break, either wait for the scheduled one or force it using the "Force Break" button in the popup.

![Pomodoro](https://i.ibb.co/vJMT41w/pomorodo.png)

During breaks, you'll receive motivational quotes from an external API ([link](https://forum.freecodecamp.org/t/free-api-inspirational-quotes-json-with-code-examples/311373)), adding a positive touch to your study routine. The break timer, along with options to start the next learning cycle or stop the learning phase, ensures a seamless Pomodoro experience.

### Daily Task

**Explanation and Instructions:**
Setting daily tasks is fundamental to maintaining productivity. By clicking the "Set Task" button in the popup, users are prompted to enter their tasks. This feature emphasizes the importance of organizing and prioritizing daily goals. The user-friendly interface provides options to save and add another task, save and close, or cancel the task entry.

![Daily Task](https://i.ibb.co/xSktNj7/daily.png)

### Night Review

**Explanation and Instructions:**
Nightly reviews play a crucial role in assessing daily productivity and setting the stage for improvement. Click the "Start Review" button in the popup to evaluate completed daily tasks and prompt a review of your day. This reflective process enhances cognitive effort, allowing users to think or write down their thoughts for a comprehensive understanding of their achievements and areas for growth.

![Night Review](https://i.ibb.co/wrrZKc2/night.png)

## Things I Had to Learn

Developing the Productive Browser extension involved acquiring knowledge about various Chrome extension APIs, including handling click and keystroke events, manipulating the DOM with conditional rendering using JavaScript, and utilizing `chrome.storage.local` for secure data storage.

## Extension Structure: Background.js, Popup.js, and Content.js

- **Background.js:** Manages the extension lifecycle and background tasks.
  
- **Popup.js:** Handles the extension popup and user interactions.
  
- **Content.js:** Injects scripts into web pages and communicates with background and popup scripts using `sendMessage` actions.

## Conclusion

The Productive Browser extension is not just a tool; it's a companion for your learning journey. By integrating note-taking, the Pomodoro Technique, daily task management, and nightly reviews, this extension empowers users to enhance their productivity, stay organized, and reflect on their progress. Install the Productive Browser today and unlock the full potential of your study sessions!
