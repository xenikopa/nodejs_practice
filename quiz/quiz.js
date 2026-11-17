import readline from 'node:readline/promises';
import process from 'node:process';
import { readFile } from 'node:fs/promises';
import { drawModule } from './drawModule.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>',
});

rl.on('error', error => {
  rl.write('Ошибка: ', error);
  rl.close();
});

const quizModule = {
  currentQuestionIndex: 0,
  progress: [],
  questions: [],
  init: async function () {
    try {
      const file = await readFile('./question.json', 'utf-8');
      this.questions = JSON.parse(file);
      this.welcome();
    } catch (err) {
      this.exit(`Произошла ошибка: ${drawModule.paintText(err, 'red')}`);
    }
  },
  welcome: function () {
    rl.write(`Добро пожаловать в программу "Квиз". Проверьте свои знания, ответив на ${this.questions.length - 1} вопросов.
Во время прохождения теста будут предложены варианты ответов. Пожалуйста, введите номер выбранного вами варианта в консоль.\n`);
    this.checkReady();
  },
  checkReady: function () {
    rl.question(`Вы готовы начать? Y/n `)
      .then(answer => {
        if (answer && answer.toLowerCase() == 'y') {
          drawModule.clear();
          this.showQuestion();
        } else {
          this.exit('Возвращайтесь в любое время!');
        }
      })
      .catch(err => {
        this.exit(`Произошла ошибка: ${drawModule.paintText(err, 'red')}`);
      });
  },
  isValidInputAnswer: function (answer, range) {
    const input = parseInt(answer, 10);
    return !Number.isNaN(input) && input > 0 && input <= range;
  },
  validateAnswer: function (answer, correctAnswer) {
    const isCorrect = (answer - 1) == correctAnswer;
    this.progress.push(isCorrect ? 'success' : 'wrong');
    drawModule.position(6, 2);
    rl.write(
      isCorrect
        ? drawModule.paintText('Правильный ответ!\n', 'green')
        : drawModule.paintText('Неправильный ответ.\n', 'red'),
    );
    this.showProgressbar();
    this.currentQuestionIndex++;
    this.showQuestion();
  },
  mapQuestion: function (question, options, index) {
    let questionBody = '';
    for (let i = 0; i < options.length; i++) {
      questionBody += `${i + 1}. ${options[i]}\n`;
    }
    return `Вопрос ${index}: ${question}\n${questionBody}\n`;
  },
  showQuestion: function () {
    if (this.currentQuestionIndex < this.questions.length) {
      const { question, options, correctIndex } =
        this.questions[this.currentQuestionIndex];
      if (this.currentQuestionIndex > 0) {
        drawModule.position(8, 2);
      }
      rl.write(
        this.mapQuestion(question, options, this.currentQuestionIndex + 1),
      );
      const ask = () => {
        rl.question('Ваш ответ: ').then(answer => {
          if (this.isValidInputAnswer(answer, options.length)) {
            this.validateAnswer(answer, correctIndex);
          } else {
            rl.write(drawModule.paintText('Некорректный ввод.\n', 'red'));
            ask();
          }
        });
      };

      ask();
    } else {
      this.summarise();
    }
  },
  showProgressbar: function () {
    drawModule.clear();
    drawModule.progressBar(this.progress, this.questions.length);
  },
  summarise: function () {
    const correctAnswers = this.progress.filter(
      answer => answer == 'success',
    ).length;
    rl.write(
      `${drawModule.paintText('\nКвиз завершен.', 'yellow')}\nВаш результат: ${correctAnswers} из ${this.questions.length}\n`,
    );
    this.exit('Спасибо за прохождение!');
  },
  exit: function (exitMessage) {
    if (exitMessage) {
      rl.write(exitMessage);
    }
    rl.close();
  },
};

quizModule.init();
