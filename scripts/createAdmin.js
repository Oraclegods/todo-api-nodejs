const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('../models/user');
const connectDB = require('../config/database');

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully:');
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();