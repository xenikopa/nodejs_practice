import { tasksModule } from './tasksModule.js';
import readline from 'node:readline/promises';
import process from 'node:process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>',
});

rl.on('error', error => {
  rl.write('Ошибка: ', error);
  rl.close();
});

export const commands = {
  parseArgs: function ([, , ...argv]) {
    const [command, ...params] = argv;
    let id = '';

    const parseText = str => [...str].join(' ').trim();
    const isValidId = id => {
      let num = parseInt(id, 10);
      return !Number.isNaN(num) && num > 0;
    };

    switch (command) {
      case 'get':
      case 'update':
      case 'status':
      case 'delete': {
        const num = params.shift();
        if (isValidId(num)) {
          id = num;
        }
        break;
      }
      default: {
        break;
      }
    }
    return { command, id, text: parseText(params) };
  },
  exec: function ({ command, id, text }) {
    if (!this[command]) {
      console.error('Неверная команда');
      process.exit();
    }
    this[command](text, id).finally(() => {
      process.exit();
    });
  },
  list: function () {
    return tasksModule.getAll().then(tasks => {
      if (tasks.length == 0) {
        console.log(
          'Задач нет. Воспользуйтесь командой add для добавления первой задачи. Больше информации - команда help.',
        );
        return;
      }
      let str = '';
      for (let i = 0; i < tasks.length; i++) {
        const { id, status, title } = tasks[i];
        str += `${id}. ${title} [${status}]\n`;
      }
      console.log(str);
    });
  },
  add: async function (task) {
    if (!task) {
      task = await rl.question('Введите название задачи в аргументах команды ');
    }
    return tasksModule.add(task).then(newTask => {
      if (newTask) {
        console.log(`Задача добавлена с идентификатором ${newTask.id}`);
      } else {
        console.error('Произошла ошибка при добавлении задачи.');
      }
    });
  },
  get: function (_, id) {
    return tasksModule.get(id).then(task => {
      if (task) {
        console.log(
          `Задача ${task.id}. Название ${task.title}, статус [${task.status}]`,
        );
      } else {
        console.error(
          'Произошла ошибка при чтении задачи, проверьте правильность id.',
        );
      }
    });
  },
  update: function (task, id) {
    return tasksModule.update(id, task, undefined).then(t => {
      if (t) {
        console.log(
          `Задача ${t.id} обновлена. Название ${t.title}, статус [${t.status}]`,
        );
      } else {
        console.error(
          'Произошла ошибка при обновлении задачи, проверьте правильность id.',
        );
      }
    });
  },
  status: function (task, id) {
    return tasksModule.update(id, undefined, task).then(task => {
      if (task) {
        console.log(
          `Задача ${task.id} обновлена. Название ${task.title}, статус [${task.status}]`,
        );
      } else {
        console.error(
          'Произошла ошибка при обновлении задачи, проверьте правильность id.',
        );
      }
    });
  },
  delete: function (_, id) {
    return tasksModule.delete(id).then(taskId => {
      if (taskId) {
        console.log(`Задача ${taskId} удалена. `);
      } else {
        console.error(
          'Произошла ошибка при удалении задачи, проверьте правильность id.',
        );
      }
    });
  },
};
