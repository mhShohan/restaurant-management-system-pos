import { ZodError } from 'zod';

interface IError {
  path: string;
  message: string;
}

const zodErrorSanitize = (err: ZodError): Record<string, IError> => {
  return err.issues.reduce(
    (acc, cur) => {
      const path = (cur.path[cur.path.length - 1] ?? 'field') as string;
      acc[path] = { path, message: cur.message };
      return acc;
    },
    {} as Record<string, IError>
  );
};

export default zodErrorSanitize;
