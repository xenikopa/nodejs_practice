import { createWriteStream, createReadStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

const getReadStream = async (file, wStream) => {
  const rStream = createReadStream(file.path, { encoding: 'utf-8' });
  rStream.on('ready', () => {
    wStream.write(`[${file.name}]\n`);
  });
  rStream.on('end', () => {
    wStream.write(`\n`);
    rStream.close();
  });
  rStream.on('error', error => {
    console.error('Ошибка чтения: ', error);
  });

  return await pipeline(rStream, wStream, { end: false });
};

const logFiles = async (filesArr, logFileName) => {
  const writeStream = createWriteStream(logFileName, { encoding: 'utf-8' });
  for (const file of filesArr) {
    await getReadStream(file, writeStream);
  }
  writeStream.close(error => {
    if (!!error) {
      console.error('Ошибка записи: ', error);
    }
  });
  console.log(`Файл ${logFileName} записан`);
};

const mapFiles = pathToCatalog => {
  return (files) =>
    files
      .filter(f => f.endsWith('.txt'))
      .map(f => ({ name: f.split('.')[0], path: `${pathToCatalog}/${f}` }));
};

const catalogReader = (pathToCatalog, resultFileName) => {
  readdir(pathToCatalog)
    .then(mapFiles(pathToCatalog))
    .then(files => logFiles(files, resultFileName))
    .catch(err => {
      console.error('Ошибка при чтении директории', err);
    });
};

catalogReader('./test', 'log.txt');
