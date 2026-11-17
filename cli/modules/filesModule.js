import { readFile, writeFile } from 'node:fs/promises';

export const filesModule = {
  filePath: './tasks.json',
  defaultEncoding: 'utf8',
  getFile: async function () {
    try {
      const file = await readFile(this.filePath, {
        encoding: this.defaultEncoding,
      });
      return JSON.parse(file);
    } catch (error) {
      // console.error('Ошибка чтения файла - ', error);
      return [];
    }
  },
  updateFile: async function (data) {
    try {
      const file = await writeFile(this.filePath, JSON.stringify(data), {
        encoding: this.defaultEncoding,
      });
      return !file;
    } catch (error) {
      console.error('Ошибка записи файла - ', error);
      return false;
    }
  },
};
