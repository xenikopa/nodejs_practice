import sharp from "sharp";
import { createWriteStream, createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const imageHandlers = { 
  resizeStream: sharp().resize(400, 400),
  grayscaleStream: sharp().greyscale(),
  blurStream: sharp().blur(),
}

const resizeImage = async (inputPath, outputPath) => {
  await pipeline(
    createReadStream(inputPath),
    imageHandlers.resizeStream,
    createWriteStream(outputPath)
  )
}

const viewChangeImage = async (inputPath, outputPath) => {
  await pipeline(
    createReadStream(inputPath),
    imageHandlers.grayscaleStream,
    imageHandlers.blurStream,
    createWriteStream(outputPath)
  )
}

resizeImage('./imgs/resize.jpeg', './imgs/result.jpeg')
  .finally(() => {
    console.log("Обработка файла завершена");
  })
  .catch(error => {
    console.error('Произошла ошибка: ', error);
  })