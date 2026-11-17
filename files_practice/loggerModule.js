import { EventEmitter } from 'node:events';
import { appendFile, stat, truncate, copyFile } from 'node:fs/promises';

export class Logger extends EventEmitter {
  constructor(filename, maxSize) {
    super();
    this.filename = filename;
    this.maxSize = maxSize;
    this.logQueue = [];
    this.writing = false;
    this.emit = super.emit;
  }

  async log(message) {
    this.logQueue.push(message);
    if (!this.writing) {
      this.writing = true;
      this.writeLog();
    }
  }

  async writeLog() {
    const [log] = this.logQueue.splice(0, 1);
    await appendFile(this.filename, `${log}\n`);
    this.emit('messageLogged', log);
    await this.checkFileSize();
    if (this.logQueue.length === 0) {
      this.writing = false;
    } else {
      this.writeLog();
    }
  }

  async getFileSize() {
    try {
      const fileStat = await stat(this.filename);
      return fileStat.size;
    } catch (err) {
      console.error('Error getFileSize - ', err);
      return 0;
    }
  }

  async checkFileSize() {
    const fileSize = await this.getFileSize();
    if (fileSize > this.maxSize) {
      this.rotateLog();
    }
  }

  rotateLog() {
    const name = this.filename.split('.')[0];
    copyFile(this.filename, `${name}.bak`)
      .then(() => truncate(this.filename, this.maxSize))
      .catch(err => {
        console.error('Error rotateLog - ', err);
      });
  }
}
