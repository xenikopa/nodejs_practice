// import { copyFolder } from "./modules/copyFolder.js";
import { Logger } from "./modules/loggerModule.js";

// copyFolder('./files/source', './files/target', (message) => console.log(message))

const logger = new Logger('log.txt', 128);
logger.on('messageLogged', message => {
  console.log('Записано сообщение:', message);
});
logger.log('Первое сообщение');
logger.log('Второе сообщение');