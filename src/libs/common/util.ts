import { ToWords } from 'to-words';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserInfo } from './user-info';
import * as fs from 'fs';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { FileDto } from './file-dto';

export class Util {
  static getTimeDifference(endTime: Date, startTime: Date): string {
    const diff = endTime.getTime() - startTime.getTime();
    let msec = diff;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    let result = hh ? hh.toString() : '00';
    result += ':' + (mm.toString() ? mm.toString() : '00');
    result += ':' + (ss.toString() ? ss.toString() : '00');
    return result;
  }
  static formatNumber(num: number | string) {
    if (!num) {
      return '';
    }
    if (typeof num === 'string') num = parseFloat(num);
    return num.toLocaleString('en-US');
  }
  static numberToWord(num: number | string) {
    if (typeof num === 'string') num = parseFloat(num);
    const toWords = new ToWords({
      localeCode: 'en-US',
      converterOptions: {
        currency: false,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          // can be used to override defaults for the selected locale
          name: 'Birr',
          plural: 'Birr',
          symbol: 'ብር',
          fractionalUnit: {
            name: 'Santim',
            plural: 'Santim',
            symbol: '',
          },
        },
      },
    });
    const fixedNumber = toWords.toFixed(num, 2);
    return toWords.convert(fixedNumber);
  }
  static addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  static formatDateWithDayName(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }
  static addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
  }
  static generateOtpCode() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }
  static hashPassword1(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, Number(process.env.BcryptHashRound));
  }
  static hashPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, Number(process.env.BcryptHashRound));
  }
  static async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static comparePassword1(
    plainPassword: string,
    encryptedPassword: string,
  ): boolean {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  }
  static GenerateToken(user: UserInfo, expiresIn = '1h') {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });
  }
  static GenerateRefreshToken(user: UserInfo, expiresIn = '30d') {
    return jwt.sign(user, process.env.REFRESH_SECRET_TOKEN, {
      expiresIn: expiresIn,
    });
  }
  static generatePassword(length = 4): string {
    let password = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }
    return password;
  }
  static generateRandomStr(length = 4): string {
    let password = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }
    return password;
  }
  static async downloadFile(
    file: FileDto,
    basePath: string,
    response?: Response,
    deleteAfterCompleted = false,
  ): Promise<StreamableFile> {
    const downloadPath = `${basePath}/${file.name}`;
    const readStream = createReadStream(downloadPath.toString());
    // if (deleteAfterCompleted) {
    //   response.on('finish', async function () {
    //     readStream.destroy();
    //     fs.access(downloadPath, (err) => {
    //       if (!err) {
    //         fs.unlink(downloadPath, (err) => {
    //           console.error(err);
    //         });
    //       }
    //     });
    //     // console.log('the response has been sent');
    //   });
    // }
    return new StreamableFile(readStream);
  }
  static deleteFile(path: string) {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
    });
  }
}
