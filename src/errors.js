export class AppError extends Error {
  constructor(message, operational = true) {
    super(message);
    this.operational = operational;
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(method) {
    super(`Method ${method} not allowed`);
    this.status = 405;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
