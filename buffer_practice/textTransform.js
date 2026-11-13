const textToBuffer = (text, encoding) => {
  try {
  return Buffer.from(text, encoding);
  } catch (err) {
    console.error('Error create buffer: ', err);
  }
}

const bufferToText = (buffer, encoding) => {
  if (!Buffer.isBuffer(buffer)) {
    console.error('Error params - buffer not buffer');
    return;
  }
  return buffer.toString(encoding);
}

const text = 'Привет, мир!';
const utf8Buffer = textToBuffer(text, 'utf-8');
console.log(utf8Buffer);

const decodedText = bufferToText(utf8Buffer, 'utf-8');
console.log(decodedText)