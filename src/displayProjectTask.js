export function displayProjectTask(taskContainer, tasks) {
    taskContainer.innerHTML = ''; // Clear previous tasks
    tasks.forEach((task, index) => {
        const card = document.createElement('div');
        card.classList.add('task-card');
        card.textContent = `${task.title} - ${task.description}`;
        taskContainer.appendChild(card);
    });
}
