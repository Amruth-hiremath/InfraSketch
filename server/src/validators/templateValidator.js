import { body, validationResult } from 'express-validator';

export const validateTemplate = [
  body('name')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be 1–100 characters'),

  body('description')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Description too long'),

  body('nodes')
    .optional()
    .isArray()
    .withMessage('Nodes must be an array'),

  body('edges')
    .optional()
    .isArray()
    .withMessage('Edges must be an array'),

  body('viewport')
    .optional()
    .isObject()
    .withMessage('Viewport must be an object'),
];

export const handleTemplateValidation = (req, next) => {
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