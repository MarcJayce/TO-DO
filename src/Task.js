class Task {
    static tasks = []; // Static array to store tasks

    constructor(title, description, priority, dueDate, completed = false, project = null) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = completed;
        this.project = project;
    }

    toggleStatus() {
        this.completed = !this.completed;
    }

    save() {
        Task.tasks.push(this); // Add the current instance to the array
        Task.saveToLocalStorage();
    }

    static saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(Task.tasks));
    }

    static loadFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        Task.tasks = tasks.map(task => new Task(task.title, task.description, task.priority, task.dueDate, task.completed, task .project));
    }

    static getAllTasks() {
        return Task.tasks; // Return all tasks
    }

    static getTasksByProject(project) {
        return Task.getAllTasks().filter(task => task.project === project);
    }

    static updateTask(index, updatedTask) {
        if (index >= 0 && index < Task.tasks.length) {
            Task.tasks[index] = updatedTask;
            Task.saveToLocalStorage();
        }
    }

    static removeTask(index) {
        Task.tasks.splice(index, 1);
        Task.saveToLocalStorage();
    }
    addProjectName(name) {
        if (typeof name === 'string' && name.trim() !== '') {
            this.project.push(name); // Add project name to the array
            console.log(`Added project name to array: ${name}`);
        } else {
            console.error('Invalid project name');
        }
    }
}


export default Task;

