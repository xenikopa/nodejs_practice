import { filesModule } from './filesModule.js';

export const tasksModule = {
  tasksList: [],
  add: async function (title) {
    if (!!title) {
      return this.getAll()
        .then(tasks => {
          const newId = tasks.length  === 0 ? 1 : tasks[tasks.length - 1].id + 1;
          tasks.push({ title, status: 'Новая', id: newId });
          return tasks;
        })
        .then(newTasks => filesModule.updateFile(newTasks))
        .then(result => {
          if (result) {
            return this.getAll().then(tasks => {
              return tasks[tasks.length - 1];
            });
          }
          return null;
        });
    }
    return null;
  },
  getAll: async function () {
    const tasks = await filesModule.getFile();
    this.tasksList = tasks;
    return this.tasksList;
  },
  get: function (id) {
    return this.getAll().then(tasks => tasks.find(t => t.id == id) || null);
  },
  getIndex: function (id) {
    return this.getAll().then(tasks => tasks.findIndex(t => t.id == id));
  },
  update: async function (id, newTitle, newStatus) {
    return this.getIndex(id)
      .then(taskIndex => {
        if (taskIndex !== -1) {
          this.tasksList[taskIndex] = {
            ...this.tasksList[taskIndex],
            title: newTitle || this.tasksList[taskIndex].title,
            status: newStatus || this.tasksList[taskIndex].status,
          };
          return filesModule.updateFile(this.tasksList);
        } else {
          return false;
        }
      })
      .then(isSuccess => {
        if (isSuccess) {
          return this.get(id);
        } else {
          return null;
        }
      });
  },
  delete: function (id) {
    return this.getIndex(id)
      .then(taskIndex => {
        if (taskIndex === -1) {
          return null;
        } else {
          this.tasksList.splice(taskIndex, 1);
          return this.tasksList;
        }
      })
      .then(newTasks => newTasks ? filesModule.updateFile(newTasks) : false)
      .then(result => (result ? id : null));
  },
};
