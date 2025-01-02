import './style.css';
import { ProjectModal } from './projectModal.js';
import { taskModal } from './taskModal.js';

// Initialize ProjectModal and taskModal
const projectModal = new ProjectModal();
const taskModalInstance = new taskModal();

// Link ProjectModal and taskModal to ensure they interact correctly
projectModal.taskModal = taskModalInstance; // Allow ProjectModal to communicate with taskModal
taskModalInstance.currentProject = null; // Initialize with no project selected

// Example: Update current project in taskModal when a project is clicked
document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');

    if (projectList) {
        projectList.addEventListener('click', (event) => {
            const projectName = event.target.textContent;

            // Set the selected project in the taskModal instance
            taskModalInstance.currentProject = projectName;

            // Display tasks only for the selected project
            taskModalInstance.displayProjectTask(projectName);
        });
    }
});

