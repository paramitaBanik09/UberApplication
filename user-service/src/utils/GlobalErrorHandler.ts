import { errorResponse } from './errorResponseFormat';
export class GlobalErrorHandler extends Error {
  constructor(private readonly error: typeof errorResponse) {
    super(error?.message);
    /* this.errorMessage = error?.message;
    this.statusCode = statusCode; */
    this.error = error;
  }
}