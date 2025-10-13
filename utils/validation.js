const Joi = require('joi');

// Validation schema for creating a todo
const createTodoSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.max': 'Title cannot be more than 100 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description cannot be more than 500 characters'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium'),
  dueDate: Joi.date()
    .greater('now')
    .optional()
    .messages({
      'date.greater': 'Due date must be in the future'
    })
});

// Validation schema for updating a todo
const updateTodoSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional(),
  description: Joi.string()
    .trim()
    .max(500)
    .allow('')
    .optional(),
  completed: Joi.boolean()
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional(),
  dueDate: Joi.date()
    .optional()
});

// Middleware to validate request body
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails
      });
    }
    
    next();
  };
};

module.exports = {
  createTodoSchema,
  updateTodoSchema,
  validate
};