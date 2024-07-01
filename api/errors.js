class ValidationError extends Error {
  constructor(message, credentialToValidate) {
    super(message);
    this.name = 'ValidationError';
    this.credentialToValidate = credentialToValidate;
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
    this.name = 'UserDoesNotExistError';
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