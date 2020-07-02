class Task {
  constructor(title, taskDate, taskTime) {
    this.title = title;
    this.taskDate = taskDate;
    this.taskTime = taskTime;
  }
}

class UI {
  addTaskToList = function (task) {
    const list = document.getElementById('task-list');

    // Create tr element
    const row = document.createElement('tr');

    // insert cols
    row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.taskDate}</td>
        <td>${task.taskTime}</td>
        <td><a href="#" class="delete">X</td>
    `;
    list.appendChild(row);
  };

  showAlert = function (message, className) {
    // Create div
    const div = document.createElement('div');

    // Add classes
    div.className = `alert ${className}`;

    // Add text
    div.appendChild(document.createTextNode(message));

    // Get parent
    const container = document.querySelector('.container');

    // Get form
    const form = document.querySelector('#task-form');

    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  };

  deleteTask = function (target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  };

  clearFields = function () {
    document.getElementById('title').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskTime').value = '';
  };
}

// Local Storage Class
class Store {
  static getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
  }

  static displayTasks() {
    const tasks = Store.getTasks();

    tasks.forEach(function (task) {
      const ui = new UI();

      // Add task to UI
      ui.addTaskToList(task);
    });
  }

  static addTask(task) {
    const tasks = Store.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static removeTask(taskTime) {
    const tasks = Store.getTasks();

    tasks.forEach(function (task, index) {
      if (task.taskTime === taskTime) {
        tasks.splice(index, 1);
      }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayTasks);

// Event listener to add task
document.getElementById('task-form').addEventListener('submit', function (e) {
  // Get form values
  const title = document.getElementById('title').value,
    taskDate = document.getElementById('taskDate').value,
    taskTime = document.getElementById('taskTime').value;

  // Instantiate task
  const task = new Task(title, taskDate, taskTime);

  // Instantiate UI
  const ui = new UI();

  // Validate
  if (title === '' || taskDate === '' || taskTime === '') {
    // Error aLert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // Add task to list
    ui.addTaskToList(task);

    //   Add to local storage
    Store.addTask(task);

    // Show success
    ui.showAlert('Task Added', 'success');

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event listener for delete
document.getElementById('task-list').addEventListener('click', function (e) {
  // Instantiate UI
  const ui = new UI();

  // Delete task
  ui.deleteTask(e.target);

  // Remove from local storage
  Store.removeTask(e.target.parentElement.previousElementSibling.textContent);

  // Show message
  ui.showAlert('Task Removed', 'success');
  e.preventDefault();
});
