import AppError from './AppError';

interface IError {
  path: string;
  message: string;
}

const handleCustomError = (err: AppError): Record<string, IError> => {
  if (err.type === 'WrongCredentials') {
    return {
      email: { path: 'email', message: 'Wrong Credentials' },
      password: { path: 'password', message: 'Wrong Credentials' },
    };
  }
  if (err.type === 'Unauthorize') {
    return {
      isAuthenticated: { path: 'auth', message: 'Unauthorize! please login' },
    };
  }
  if (err.type === 'NOT_FOUND' || err.type === 'Validation') {
    return {};
  }
  return {};
};

export default handleCustomError;
