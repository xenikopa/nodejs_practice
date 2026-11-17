import { EventEmitter } from 'node:events';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Timer extends EventEmitter {
  constructor() {
    super();
    this.counter = 0;
  }

  emit(name, ...args) {
    this.counter++;
    super.emit(name, { ...args, counter: this.counter });
  }

  sleep() {
    const emit = this.emit;
    this.emit = () => {};
    return () => this.wakeUp(emit);
  }

  wakeUp(emitFunc) {
    this.emit = emitFunc;
  }

  checkProceed(handler) {
    rl.question(`Proceed timer? Y/n - `, answer => {
      if (!answer) {
        rl.close();
      }
      let answerValue = answer.toLowerCase();
      
      if (answerValue !== 'y') {
        rl.close();
      }

      handler(answerValue);
    });
  }
}

const timer = new Timer();

const interval = setInterval(() => {
  timer.emit('tick');
}, 1000);

timer.addListener('tick', ({ counter }) => {
  console.log('Tick - ', counter);
  if (counter % 5 === 0) {
    let wakeupHandler = timer.sleep();
    timer.checkProceed((answer) => {
      if (answer === 'y') {
        wakeupHandler();
      } else {
        console.log('End');
        clearInterval(interval);
        timer.removeAllListeners();
      }
    })
  }
});

timer.addListener('error', (err) => {
  console.log(err);
})

