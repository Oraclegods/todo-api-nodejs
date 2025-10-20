const express = require('express');
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
} = require('../controllers/todoController');
const { validate, createTodoSchema, updateTodoSchema } = require('../utils/validation');

const { protect } = require('../middleware/auth');
const router = express.Router();


// Protect all todo routes
router.use(protect);

// GET /api/todos - Get all todos with optional filtering and pagination
router.get('/', getTodos);

// GET /api/todos/:id - Get single todo
router.get('/:id', getTodo);

// POST /api/todos - Create new todo
router.post('/', validate(createTodoSchema), createTodo);

// PUT /api/todos/:id - Update todo
router.put('/:id', validate(updateTodoSchema), updateTodo);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', deleteTodo);

// PATCH /api/todos/:id/toggle - Toggle completion status
router.patch('/:id/toggle', toggleTodo);

module.exports = router;