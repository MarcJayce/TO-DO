import Task from './Task';
import { displayProjectTask } from './displayProjectTask.js';
export class taskModal {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.container = document.getElementById("task-modal-container");
            if (!this.container) {
                console.error('Container with ID "task-modal-container" not found');
                return;
            }

            Task.loadFromLocalStorage(); // Load tasks from local storage
            
            this.createModal();
            this.setupOpenModalListener();
            this.setupOutsideClickListener();
            this.setupCompletedButtonListener();
            this.setupAllTaskButton();
            this.setupImportantButton();
            this.displayTasks();
            this.hide();
            
        });
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'hidden';

        this.modalContent = document.createElement('div');
        this.modalContent.className = 'modal-content';

        this.closeBtn = document.createElement('span');
        this.closeBtn.className = 'close-btn';
        this.closeBtn.innerHTML = '&times;';
        this.closeBtn.addEventListener('click', () => {
            this.hide();
        });

        this.modalTitle = document.createElement('h2');
        this.modalTitle.textContent = 'Add New Task';

        this.form = document.createElement('form');
        this.form.innerHTML = `
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" placeholder="Enter title" required><br><br>
            <label for="description">Description:</label>
            <textarea id="description" name="description" placeholder="Enter description" required></textarea><br><br>
            <label for="priority">Priority:</label>
            <select id="priority" name="priority" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select><br><br>
            <label for="dueDate">Due Date:</label>
            <input type="date" id="dueDate" name="dueDate" required><br><br>
            <button type="submit">Add Task</button>
        `;

        this.form.addEventListener('submit', (event) => {
            this.handleSubmit(event);
        });

        this.modalContent.append(this.closeBtn, this.modalTitle, this.form);
        this.modal.appendChild(this.modalContent);
        this.container.appendChild(this.modal);
    }

    setupOpenModalListener() {
        const openTaskModalBtn = document.getElementById("openTaskModalBtn");
        if (!openTaskModalBtn) {
            console.error('Open modal button not found');
            return;
        }
        openTaskModalBtn.addEventListener('click', () => {
            this.show();
        });
    }

    setupOutsideClickListener() {
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.hide();
            }
        });
    }

    setupCompletedButtonListener() {
        const completedButton = document.querySelector('.complete');
        completedButton.addEventListener('click', () => {
            this.displayCompletedTasks();
        });
    }

    setupAllTaskButton(){
        console.log('setupAllTaskButton called');
        const Task = document.querySelector('.all')
        Task.addEventListener('click', () => {
            this.displayTasks();
            console.log('All Task button clicked');
        } );
    }

    setupImportantButton(){
        console.log('setupButton called');
        const Today = document.querySelector('.important')
        Today.addEventListener('click', () => {
            this.displayImportantTasks();
            console.log('important Task button clicked');
            const name = document.querySelector('.name')
            name.textContent = "Important Task";
        } );
    }
    show() {
        this.modal.classList.remove('hidden');
    }

    hide() {
        this.modal.classList.add('hidden');
    }

    createTask() {
        const title = this.form.querySelector('#title').value.trim();
        const description = this.form.querySelector('#description').value.trim();
        const priority = this.form.querySelector('#priority').value;
        const dueDate = this.form.querySelector('#dueDate').value;

        const newTask = { title, description, priority, dueDate, completed: false };
        this.form.reset();
        return newTask;
    }

    handleSubmit(event) {
        event.preventDefault();
        const newTask = this.createTask();

        const taskInstance = new Task(
            newTask.title,
            newTask.description,
            newTask.priority,
            newTask.dueDate,
            newTask.completed,
            this.currentProject
        );
        taskInstance.save();

        console.log(Task.getAllTasks());
        this.displayProjectTask(this.currentProject);
        this.hide();
    }
    displayTasks() {
        const name = document.querySelector('.name');
        name.textContent = 'All Task';
        const taskContainer = document.getElementById('task-list-container');
        taskContainer.innerHTML = ''; 

        Task.getAllTasks().forEach((task, index) => {
            if (!task.completed) { // Only show tasks that are not completed
                const card = this.createTaskCard(task, index);
                taskContainer.appendChild(card); 
            }
        });
    }

  
    displayCompletedTasks() {
        const name = document.querySelector('.name')
            name.textContent = "Completed Task";
        const taskContainer = document.getElementById('task-list-container');
        if (!taskContainer) {
            console.error('Task list container not found');
            return;
        }
    
        taskContainer.innerHTML = ''; // Clear the task container
    
        Task.getAllTasks().forEach((task, index) => {
            if (task.completed) { // Only show completed tasks
                const card = this.createTaskCard(task, index);
                taskContainer.appendChild(card); // Add completed tasks
            }
        });
    }
    displayProjectTask(projectName){
        const taskContainer = document.getElementById('task-list-container');
        taskContainer.innerHTML = '';

       // Filter tasks for the specified project
    const projectTasks = Task.getTasksByProject(projectName);

    // Iterate over all tasks and display only those belonging to the project
    Task.getAllTasks().forEach((task, index) => {
        if (projectTasks.includes(task) && !task.completed ) {
            const card = this.createTaskCard(task, index);
            taskContainer.appendChild(card);
        }
        });
    }
    displayImportantTasks(){
        const taskContainer = document.getElementById('task-list-container');
        taskContainer.innerHTML = '';

        Task.getAllTasks().forEach((task, index) => {
            if (task.priority === "high" && !task.completed) {
                const card = this.createTaskCard(task, index);
                taskContainer.appendChild(card); 
            }
        });

    }
    
    createTaskCard(task, index) {
        const card = document.createElement("div");
        card.classList.add("task-card");

        const title = document.createElement("div");
        title.textContent = task.title;
        title.classList.add("task-title");

        const description = document.createElement("div");
        description.textContent = `Description: ${task.description}`;
        description.classList.add("task-description");

        const priority = document.createElement("div");
        priority.textContent = `Priority: ${task.priority}`;
        priority.classList.add("task-priority");

        const dueDate = document.createElement("div");
        dueDate.textContent = `Due Date: ${task.dueDate}`;
        dueDate.classList.add("task-due-date");

        // Toggle Complete Switch
        const toggleCompleteSwitch = document.createElement("label");
        toggleCompleteSwitch.classList.add("switch");

        const switchInput = document.createElement("input");
        switchInput.type = "checkbox";
        switchInput.checked = task.completed;
        switchInput.addEventListener("change", () => {
            task.toggleStatus(); 
            Task.updateTask(index, task); 
            this.displayTasks();
             // Refresh the task list
        });

        const switchSlider = document.createElement("span");
        switchSlider.classList.add("slider");

        toggleCompleteSwitch.appendChild(switchInput);
        toggleCompleteSwitch.appendChild(switchSlider);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-btn");
        removeButton.addEventListener("click", () => {
            this.removeTask(index);
        });

        card.append(title, description, priority, dueDate, toggleCompleteSwitch, removeButton);

        return card;
    }

    removeTask(index) {
        Task.tasks.splice(index, 1); 
        Task.saveToLocalStorage();
        this.displayTasks(); 
    }
}

export default taskModal;
