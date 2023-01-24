import HttpStatusCode from '../models/http-status-code';

export class AppError extends Error {
  private _status: HttpStatusCode;
  private _parent?: Error;
  constructor(status: HttpStatusCode, name: string, message: string, parent?: Error) {
    super();
    this._status = status;
    this.name = name;
    this.message = message;
    this._parent = parent;
  }

  public get status(): HttpStatusCode {
    return this._status;
  }

  public get parent(): Error | undefined {
    return this._parent;
  }
}
