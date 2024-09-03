import Handlebars from 'handlebars';
import path from 'path';
import * as fs from 'fs-extra';
import { Util } from './util';
export const length = (arr) => {
  return arr.length;
};
export const dateFormat = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};
export const numberFormat = (num: number | string) => {
  if (!num) {
    return '';
  }

  if (typeof num === 'string') num = parseFloat(num);
  num = parseFloat(num.toFixed(2));
  return num.toLocaleString('en-US');
};
export const isEquals = (arg1: string, arg2: string) => {
  return arg1.toLowerCase() === arg2.toLowerCase();
};
export const isNotEquals = (arg1: string, arg2: string) => {
  return arg1.toLowerCase() !== arg2.toLowerCase();
};
export const absoluteNumberFormat = (num: number | string) => {
  if (!num) {
    return '';
  }
  if (typeof num === 'string') num = parseFloat(num);
  num = parseFloat(num.toFixed(2));
  if (num < 0) {
    const positiveNum = num * -1.0;
    return `(${positiveNum.toLocaleString('en-US')})`;
  } else return num.toLocaleString('en-US');
};
export const numberIncrement = (num: string | number) => {
  if (typeof num === 'string') num = parseInt(num);
  return num + 1;
};
export const subtract = (num1: number, num2: number) => {
  return (num1 - num2).toFixed(2);
};
export const numberToWord = (num) => {
  return Util.numberToWord(num);
};

Handlebars.registerHelper('eq', (a, b) => {
  return a === b;
});
Handlebars.registerHelper('gt', (a, b) => {
  console.log(a, b);
  return a > b;
});
Handlebars.registerHelper('gte', (a, b) => {
  return a >= b;
});
Handlebars.registerHelper('lt', (a, b) => {
  return a < b;
});
Handlebars.registerHelper('lte', (a, b) => {
  return a <= b;
});
Handlebars.registerHelper('ne', (a, b) => {
  return a !== b;
});
Handlebars.registerHelper('length', length);
Handlebars.registerHelper('dateFormat', dateFormat);
Handlebars.registerHelper('numberFormat', numberFormat);
Handlebars.registerHelper('absoluteNumberFormat', absoluteNumberFormat);
Handlebars.registerHelper('numberIncrement', numberIncrement);
Handlebars.registerHelper('subtract', subtract);
Handlebars.registerHelper('numberToWord', numberToWord);
Handlebars.registerHelper('isEquals', isEquals);
Handlebars.registerHelper('isNotEquals', isNotEquals);
export class HandlebarEngine {
  static async compile(template: string, data: object): Promise<string> {
    const filePath = path.join(
      process.cwd(),
      'src/templates',
      `${template}.hbs`,
    );
    const html = await fs.readFile(filePath, 'utf8');
    return Handlebars.compile(html)(data);
  }
}
