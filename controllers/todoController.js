const Todo = require('../models/Todo');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all todos for authenticated user
// @route   GET /api/todos
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, completed, priority } = req.query;
  
  // Build filter object - only get todos for the authenticated user
  const filter = { user: req.user.id };
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
// @access  Private
const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });
  
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
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.create({
    ...req.body,
    user: req.user.id
  });
  
  res.status(201).json({
    success: true,
    data: todo
  });
});

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
  let todo = await Todo.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
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
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }
  
  await Todo.findOneAndDelete({ 
    _id: req.params.id, 
    user: req.user.id 
  });
  
  res.status(200).json({
    success: true,
    message: 'Todo deleted successfully'
  });
});

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });
  
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