// Type definitions for the scrypt-async.
// Taken directly from the v1.3.2 of @types/scrypt-async, and updated
// for modern TS.
//
// scrypt-async Project: https://github.com/dchest/scrypt-async-js
// Definitions by: Kaur Kuut <https://github.com/xStrom>
//                 Stefano Sicco <https://github.com/stesix>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Definitions by: Owan Hunte <https://github.com/owanhunte>

declare module "scrypt-async" {
  interface CallbackFunc {
    (key: any): any;
  }

  interface Options {
    N?: number | undefined;
    logN?: number | undefined;
    r: number;
    p: number;
    dkLen: number;
    encoding?: string | undefined;
    interruptStep?: number | undefined;
  }

  interface ScryptStatic {
    (
      password: string | number[],
      salt: string | number[],
      options: Options,
      callback: CallbackFunc
    ): void;
    (
      password: string | number[],
      salt: string | number[],
      logN: number,
      r: number,
      dkLen: number,
      interruptStep: number,
      callback: CallbackFunc,
      encoding: string
    ): void;
    (
      password: string | number[],
      salt: string | number[],
      logN: number,
      r: number,
      dkLen: number,
      interruptStep: number,
      callback: CallbackFunc
    ): void;
    (
      password: string | number[],
      salt: string | number[],
      logN: number,
      r: number,
      dkLen: number,
      callback: CallbackFunc,
      encoding: string
    ): void;
    (
      password: string | number[],
      salt: string | number[],
      logN: number,
      r: number,
      dkLen: number,
      callback: CallbackFunc
    ): void;
  }

  const scrypt: ScryptStatic;

  export default scrypt;
}
