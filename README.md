# TaskVista - Simple Task Management System
Developed a client-side task management web application that allows users to create, categorize, and manage daily tasks using only HTML, CSS, and JavaScript. The system should visualize tasks based on categories and tags, and persist data using the browser’s localStorage.
A clean and simple task management application that uses localStorage for data persistence.

## Features

- **Add Tasks**: Create new tasks with title, category, and priority level
- **Task Categories**: Work, Study, Personal, Health, Finance
- **Priority Tags**: High (Red), Medium (Green), Low (Blue)
- **Mark Complete**: Toggle task completion status
- **Delete Tasks**: Remove unwanted tasks
- **Filter by Category**: View tasks by specific category
- **Clear Completed**: Remove all completed tasks at once
- **Local Storage**: All data is automatically saved in your browser's localStorage

## How It Works

1. **Automatic Loading**: The application automatically loads existing tasks from localStorage when it starts
2. **Adding Tasks**: When you add a new task, it's immediately saved to localStorage
3. **Saving Changes**: All changes (add, complete, delete) are automatically saved to localStorage
4. **Data Persistence**: Tasks persist across browser sessions and page reloads
5. **No File Management**: Everything is handled automatically through browser storage

## File Structure

```
TaskVista/
├── index.html          # Main HTML interface
├── script.js           # JavaScript functionality
├── styles.css          # CSS styling
└── README.md           # This file
```

## Usage

1. Open `index.html` in a web browser
2. The app will automatically load existing tasks from localStorage
3. Add new tasks using the form
4. Mark tasks as complete/incomplete by clicking on them
5. Delete tasks using the delete button
6. Filter tasks by category using the dropdown
7. Clear completed tasks using the "Clear Completed" button
8. All changes are automatically saved to localStorage

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- LocalStorage API
- CSS Grid and Flexbox

## Notes

- All data is stored in your browser's localStorage
- Tasks persist across browser sessions and page reloads
- No external files or imports/exports needed
- Data is automatically saved after every change
- The app will load sample tasks if no existing data is found

## Sample Task Structure

```json
{
  "id": 1705312200000,
  "title": "Complete project proposal",
  "category": "Work",
  "tag": "red",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

Enjoy organizing your tasks with TaskVista! 🎯 
