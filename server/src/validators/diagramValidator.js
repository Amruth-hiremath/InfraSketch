import { body, validationResult } from 'express-validator';

export const validateDiagram = [
  body('name').optional().isString().isLength({ min: 1, max: 100 }),
  body('description').optional().isString().isLength({ max: 500 }),
  body('nodes').optional().isArray(),
  body('edges').optional().isArray(),
  body('viewport').optional().isObject(),
];

export const handleValidation = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({
      status: 400,
      message: errors.array()[0].msg,
    });
    return true;
  }
  return false;
};