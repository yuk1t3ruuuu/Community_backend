import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

  export class InternarException extends HttpException {
    // ステータスをデフォルトで500に設定
    constructor(message?: string) {
      super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  