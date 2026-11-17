import process from 'node:process';

const write = str => process.stdout.write(str);

const textColors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
};

const bgColors = Object.keys(textColors).map(key => ({
  key: textColors[key] + 10,
}));

const bordersChars = {
  leftCorner: {
    top: '┌',
    bottom: '└',
  },
  rightCorner: {
    top: '⁠┐',
    bottom: '⁠┘',
  },
  lineHorizontal: '─',
  lineVertical: '│',
};

const mapColor = (color, type = 'text') => {
  const colorCode = type === 'text' ? textColors[color] : bgColors[color];
  if (colorCode) {
    return text => `\x1b[${colorCode}m${text}\x1b[0m`;
  }

  return text => text;
};

export const drawModule = {
  position: function (row, col) {
    write(`\x1b[${row};${col}H`);
  },
  clear: function () {
    write('\x1Bc');
  },
  paintText: function (text, color) {
    return mapColor(color, 'text')(text);
  },
  paintBg: function (text, color) {
    return mapColor(color, 'bg')(text);
  },
  drawBox: function (row, col, width, height, fillChar) {
    const w = width - 2;
    const h = height - 2;

    this.position(row, col);
    write(
      bordersChars.leftCorner.top +
        bordersChars.lineHorizontal.repeat(w) +
        bordersChars.rightCorner.top,
    );

    for (let i = 1; i < h; i++) {
      this.position(row + i, col);
      const fill = fillChar ? fillChar : ' '.repeat(w);
      write(bordersChars.lineVertical + fill + bordersChars.lineVertical);
    }

    this.position(row + h, col);
    write(
      bordersChars.leftCorner.bottom +
        bordersChars.lineHorizontal.repeat(w) +
        bordersChars.rightCorner.bottom,
    );
  },
  progressBar: function (progress, fullCount) {
    write(`Выполнено ${progress.length} из ${fullCount}\n`);
    const fill = Array(fullCount)
      .fill('⁠▉')
      .map((str, i) => {
        const result = progress[i];
        if (result) {
          const color = result == 'success' ? 'green' : 'red';
          return this.paintText(str, color);
        }
        return this.paintText(str, 'white');
      })
      .join('')
      .trim();
    this.drawBox(4, 2, fullCount * 2 + 2, 4, fill);
  },
};
