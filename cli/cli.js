#!/usr/bin/env node

import { commands } from './modules/commands.js';

(function () {
  const args = commands.parseArgs(process.argv);
  if (args.command == 'help' || args.command == 'h') {
    console.log(`
  add <task description>  |  добавить новую задачу.
  list                    |  вывести список всех задач.
  get <id>                |  вывести информацию о задаче с указанным идентификатором.
  update <id> <newTask>   |  обновить задачу с указанным идентификатором.
  status <id> <newStatus> |  обновить статус задачи с указанным идентификатором.
  delete <id>             |  удалить задачу с указанным идентификатором.
`);
    return;
  }

  commands.exec(args);

})();
