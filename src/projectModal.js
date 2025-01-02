import { ProjectManager } from './ProjectManager.js';
import { displayProjectTask } from './displayProjectTask.js';
export class ProjectModal {
    constructor() {
        this.container = null; // Initialize with null, will be set later
        this.projectManager = new ProjectManager();
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM fully loaded and parsed');

            this.container = document.getElementById('content-area');
            if (!this.container) {
                console.error('Container with ID "content-area" not found');
                return;
            }

            // Create modal structure
            this.modal = document.createElement('div');
            this.modal.className = 'hidden';

            this.modalContent = document.createElement('div');
            this.modalContent.className = 'modal-content-two';

            this.closeBtn = document.createElement('span');
            this.closeBtn.className = 'close-btn';
            this.closeBtn.innerHTML = '&times;';
            this.closeBtn.addEventListener('click', () => {
                console.log('Close button clicked');
                this.hide();
            });

            this.modalTitle = document.createElement('h2');
            this.modalTitle.textContent = 'Add New Project';

            this.form = document.createElement('form');
            this.form.innerHTML = `
                <label for="projectName">Project Name:</label>
                <input type="text" id="projectName" name="projectName" placeholder="Project Name"><br><br>
                <button type="submit">Add Project</button>
            `;

            this.form.addEventListener('submit', (event) => {
                console.log('Form submitted');
                this.handleSubmit(event);
            });

            this.modalContent.append(this.closeBtn, this.modalTitle, this.form);
            this.modal.appendChild(this.modalContent);
            this.container.appendChild(this.modal);

            // Add event listener to close modal when clicking outside of it
            window.addEventListener('click', (event) => {
                if (event.target === this.modal) {
                    console.log('Clicked outside modal');
                    this.hide();
                }
            });

            // Setup event listener to open the modal
            this.setupOpenModalListener();
            // Ensure modal is hidden on initialization
            this.hide();

            // Create a section for displaying projects
            this.projectList = document.createElement('ul');
            this.projectList.id = 'project-list';
            this.container.appendChild(this.projectList);

            // Load and display projects from localStorage
            this.displayProjects();
        });
    }

    setupOpenModalListener() {
        const openModalBtn = document.getElementById('openModalBtn');
        if (!openModalBtn) {
            console.error('Open modal button not found');
            return;
        }
        openModalBtn.addEventListener('click', () => {
            console.log('Open modal button clicked');
            this.show();
        });
    }

    show() {
        console.log('Showing modal');
        this.modal.classList.remove('hidden');
    }

    hide() {
        console.log('Hiding modal');
        this.modal.classList.add('hidden');
    }

    createProject() {
        const projectName = this.form.elements.projectName.value;
        this.form.reset();
        return projectName;
    }

    handleSubmit(event) {
        event.preventDefault();
        const newProject = this.createProject();
        if (newProject) {
            this.projectManager.addProject(newProject);
            this.displayProjects();
            this.hide();
        }
    }

    displayProjects() {
        console.log('Displaying projects');
        this.projectList.innerHTML = ''; // Clear the current list

        this.projectManager.projects.forEach((project, index) => {
            const listItem = document.createElement('li');

            // Project name clickable
            const projectName = document.createElement('span');
            projectName.textContent = project;
            projectName.className = 'project-name';
            projectName.style.cursor = 'pointer';

            // Navigate to task page when project is clicked
            projectName.addEventListener('click', () => {
                console.log(`Navigating to task page for project: ${project}`);
                const name = document.querySelector('.name');
                name.textContent = project;
            
                this.taskModal.currentProject = project; // Set the current project
                this.taskModal.displayProjectTask(project); // Display tasks for this project
            });
            

            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            removeBtn.className = 'remove-btn-two';
            removeBtn.style.marginLeft = '10px';

            // Remove project functionality
            removeBtn.addEventListener('click', () => {
                console.log(`Removing project: ${project}`);
                this.projectManager.removeProject(index);
                this.displayProjects(); // Re-render the project list
            });

            listItem.appendChild(projectName);
            listItem.appendChild(removeBtn);
            this.projectList.appendChild(listItem);
        });
    }
}