import { EventEmitter } from 'node:events';

class Messanger extends EventEmitter {}

const messanger = new Messanger();

messanger.addListener('onSendMessage', ({username, message}) => {
  receiveMessage(`New message from ${username}: ${message}`);
})

const sendMessage = (username, message) => {
  messanger.emit('onSendMessage', {username, message});
}

const receiveMessage = (message) => {
  console.log(message);
}

sendMessage('test', 'hello world');
sendMessage('test', 'hello world 1');
sendMessage('test', 'hello world 2');