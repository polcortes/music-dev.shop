class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UserAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

class UserDoesNotExistError extends Error {
  constructor(message, username) {
    super(message);
    this.name = 'UserDoesNotExistsError';
    this.username = username;
  }
}

class UserBadCredentialsError extends Error {
  constructor(message, username) {
    super(message);
    this.name = 'UserBadCredentialsError';
    this.username = username;
  }
}

export { ValidationError, UserAlreadyExistsError, UserDoesNotExistError, UserBadCredentialsError };