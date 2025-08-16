// Task Management System - JavaScript

class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = '';
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.renderTasks();
        this.updateNoTasksMessage();
    }

    setupEventListeners() {
        // Task form submission
        const taskForm = document.getElementById('taskForm');
        taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderTasks();
        });

        // Clear completed tasks
        const clearCompletedBtn = document.getElementById('clearCompleted');
        clearCompletedBtn.addEventListener('click', () => this.clearCompletedTasks());
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskTitle = formData.get('taskTitle') || document.getElementById('taskTitle').value;
        const taskCategory = formData.get('taskCategory') || document.getElementById('taskCategory').value;
        const taskTag = formData.get('taskTag') || this.getSelectedTag();

        if (!taskTitle || !taskCategory || !taskTag) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            title: taskTitle,
            category: taskCategory,
            tag: taskTag,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.addTask(task);
        e.target.reset();
        this.showMessage('Task added successfully!', 'success');
    }

    getSelectedTag() {
        const selectedTag = document.querySelector('input[name="taskTag"]:checked');
        return selectedTag ? selectedTag.value : null;
    }

    addTask(task) {
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateNoTasksMessage();
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateNoTasksMessage();
        this.showMessage('Task deleted successfully!', 'success');
    }

    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasks();
        this.renderTasks();
        this.updateNoTasksMessage();
        this.showMessage(`${completedCount} completed task(s) cleared!`, 'success');
    }

    getFilteredTasks() {
        if (!this.currentFilter) {
            return this.tasks;
        }
        return this.tasks.filter(task => task.category === this.currentFilter);
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '';
            this.updateNoTasksMessage();
            return;
        }

        tasksList.innerHTML = filteredTasks
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(task => this.createTaskHTML(task))
            .join('');

        // Add event listeners to task items
        this.addTaskEventListeners();
    }

    createTaskHTML(task) {
        const completedClass = task.completed ? 'completed' : '';
        const completedIcon = task.completed ? '✓' : '○';
        const completedText = task.completed ? 'Mark Incomplete' : 'Mark Complete';
        
        return `
            <div class="task-item ${completedClass}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-actions">
                        <button class="complete-btn" title="${completedText}">${completedIcon}</button>
                        <button class="delete-btn" title="Delete Task">🗑</button>
                    </div>
                </div>
                <div class="task-meta">
                    <span class="task-category">${this.escapeHtml(task.category)}</span>
                    <span class="task-tag ${task.tag}">${this.getTagText(task.tag)}</span>
                </div>
            </div>
        `;
    }

    getTagText(tag) {
        const tagTexts = {
            'red': 'High Priority',
            'green': 'Medium Priority',
            'blue': 'Low Priority'
        };
        return tagTexts[tag] || tag;
    }

    addTaskEventListeners() {
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            const taskId = parseInt(item.dataset.taskId);
            
            // Complete button
            const completeBtn = item.querySelector('.complete-btn');
            completeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTaskCompletion(taskId);
            });

            // Delete button
            const deleteBtn = item.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(taskId);
            });

            // Click on task item to toggle completion
            item.addEventListener('click', () => {
                this.toggleTaskCompletion(taskId);
            });
        });
    }

    updateNoTasksMessage() {
        const noTasks = document.getElementById('noTasks');
        const tasksList = document.getElementById('tasksList');
        
        if (this.tasks.length === 0) {
            noTasks.style.display = 'block';
            tasksList.style.display = 'none';
        } else if (this.getFilteredTasks().length === 0) {
            noTasks.style.display = 'block';
            noTasks.innerHTML = '<p>No tasks found for the selected category.</p>';
            tasksList.style.display = 'none';
        } else {
            noTasks.style.display = 'none';
            tasksList.style.display = 'flex';
        }
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;
        
        // Add error styling
        if (type === 'error') {
            messageDiv.style.background = '#f44336';
        }

        document.body.appendChild(messageDiv);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        try {
            localStorage.setItem('taskVista_tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
            this.showMessage('Error saving tasks. Please check your browser storage.', 'error');
        }
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('taskVista_tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            } else {
                // If no localStorage data, load sample tasks for demonstration
                this.loadSampleTasks();
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            this.showMessage('Error loading saved tasks.', 'error');
            this.tasks = [];
        }
    }

    // Load sample tasks for demonstration
    loadSampleTasks() {
        const sampleTasks = [
            {
                id: Date.now() - 3,
                title: "Complete project proposal",
                category: "Work",
                tag: "red",
                completed: false,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: Date.now() - 2,
                title: "Study JavaScript fundamentals",
                category: "Study",
                tag: "green",
                completed: true,
                createdAt: new Date(Date.now() - 43200000).toISOString()
            },
            {
                id: Date.now() - 1,
                title: "Go for a walk",
                category: "Health",
                tag: "blue",
                completed: false,
                createdAt: new Date(Date.now() - 21600000).toISOString()
            }
        ];
        
        this.tasks = sampleTasks;
        this.saveTasks();
        console.log('Loaded sample tasks for demonstration');
    }

    // Utility method to get task statistics
    getTaskStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        return { total, completed, pending };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
}); 