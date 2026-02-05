import { MethodNotAllowedError, NotFoundError } from '../errors.js';

export function handleNotFound(req, res) {
  throw new NotFoundError('Resource not found');
}

export function handleMethodNotValid(req, res) {
  throw new MethodNotAllowedError(req.method);
}

export function handleError(err, req, res, next) {
  console.log(err);
  if (err.operational) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error('Error:', {
    message: err.message,
    resource: req.path,
    method: req.method,
    stack: err.stack
  });

  res.status(500).json({ error: 'Internal server error' });
}
