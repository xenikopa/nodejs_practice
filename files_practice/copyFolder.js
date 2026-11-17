import fs from 'node:fs/promises';

const getStats = async path => {
  try {
    return await fs.stat(path);
  } catch (err) {
    throw new Error(`Ошибка получения статистики - ${err}`);
  }
};

const byteToMb = size => (size / (1024 * 1024)).toFixed(0);

const processFiles = async (initPath, newPath) => {
  try {
    const files = await fs.readdir(initPath);
    if (files.length === 0) {
      return;
    }
    for (const file of files) {
      const fileStat = await getStats(`${initPath}/${file}`);
      if (fileStat.isFile()) {
        const isFileValid = byteToMb(fileStat.size) < 10;
        if (isFileValid) {
          await fs.copyFile(`${initPath}/${file}`, `${newPath}/${file}`);
        } else {
          throw new Error(`Ошибка: Файл не должен превышать 10 МБ - ${file}`);
        }
      } else if (fileStat.isDirectory()) {
        fs.mkdir(`${newPath}/${file}`, { recursive: true })
          .then(() => processFiles(`${initPath}/${file}`, `${newPath}/${file}`))
          .catch(err => {
            throw new Error(`Ошибка для ${file}: ${err}`);
          });
      } else {
        throw new Error(`Ошибка: Неизвестный тип файла - ${file}`);
      }
    }
  } catch (err) {
    throw new Error(`Ошибка чтения директории - ${err}`);
  }
  return null;
};

export const copyFolder = async (sourceDir, targetDir, callback) => {
  if (!callback) {
    return;
  }

  try {
    const sourceStats = await getStats(sourceDir);
    const targetStats = await getStats(targetDir);
    if (sourceStats.isDirectory() && targetStats.isDirectory()) {
      const result = await processFiles(sourceDir, targetDir);
      callback(result);
    } else {
      callback(`Ошибка входящих параметров`);
    }
  } catch (err) {
    callback(`Ошибка программы - ${err}`);
  }
};
