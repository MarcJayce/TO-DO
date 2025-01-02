export class ProjectManager {
    constructor() {
        this.projects = this.loadProjects();
    }

    addProject(project) {
        this.projects.push(project);
        this.saveProjects();
    }

    removeProject(index) {
        this.projects.splice(index, 1);
        this.saveProjects();
    }

    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    loadProjects() {
        const projects = localStorage.getItem('projects');
        return projects ? JSON.parse(projects) : [];
    }
    getProjectName(index) {
        return this.projects[index] || null; // Return project name by index
    }
}
