const Todo = require('../models/Todo');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
const getTodos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, completed, priority } = req.query;
  
  // Build filter object
  const filter = {};
  if (completed !== undefined) {
    filter.completed = completed === 'true';
  }
  if (priority) {
    filter.priority = priority;
  }
  
  // Execute query with pagination
  const todos = await Todo.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  // Get total count for pagination info
  const total = await Todo.countDocuments(filter);
  
  res.status(200).json({
    success: true,
    count: todos.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: todos
  });
});

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Public
const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: todo
  });
});

// @desc    Create new todo
// @route   POST /api/todos
// @access  Public
const createTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.create(req.body);
  
  res.status(201).json({
    success: true,
    data: todo
  });
});

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = asyncHandler(async (req, res) => {
  let todo = await Todo.findById(req.params.id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  todo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true, // Return updated document
      runValidators: true // Run model validators on update
    }
  );
  
  res.status(200).json({
    success: true,
    data: todo
  });
});

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  await Todo.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Todo deleted successfully'
  });
});

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Public
const toggleTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  todo.completed = !todo.completed;
  await todo.save();
  
  res.status(200).json({
    success: true,
    data: todo
  });
});

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo
};