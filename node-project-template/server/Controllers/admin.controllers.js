import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import Admin from '../Models/admin.js'; // Ensure correct path
import dotenv from 'dotenv';
dotenv.config();

// Register a new admin
export const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    console.log(existingAdmin);
    if (existingAdmin) {
      return res.status(400).json({ statusCode: 400, message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    console.log('Plain Password:', password);
    console.log('Hashed Password:', hashedPassword);

    // Create a new admin
    const newAdmin = await Admin.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    return res.status(200).json({ statusCode: 200, message: 'Admin registered successfully', data: { adminId: newAdmin.id } });
  } catch (error) {
    console.error('Error registering admin:', error);
    return res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({ statusCode: 400, message: 'Invalid credentials' });
    }

    console.log('Password provided by user:', password);
    console.log('Hashed password in DB:', admin.password_hash);

    // Check if password matches using argon2
    const isMatch = await argon2.verify(admin.password_hash, password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ statusCode: 400, message: 'Invalid credentials' });
    }

    // Retrieve the role of the admin from the Admin table
    const role = admin.role;  // role will be 'admin' or 'superadmin'

    // Generate JWT token with admin's role included
    const token = jwt.sign(
      { id: admin.id, email: admin.email, username: admin.username, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Token expiration time
    );

    // Send the token in the response
    return res.status(200).json({
      statusCode: 200,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};


// Get current logged-in admin info (getMe)
export const getMe = async (req, res) => {
  try {
    // `req.admin` will be available if the user is authenticated
    const admin = await Admin.findByPk(req.admin.id);

    if (!admin) {
      return res.status(404).json({ statusCode: 404, message: 'Admin not found' });
    }

    return res.status(200).json({
      statusCode: 200,
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role, // Assuming you have a 'role' field in the admin model
    });
  } catch (error) {
    console.error('Error fetching admin info:', error);
    return res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
};

// Export all controllers
export default { registerAdmin, loginAdmin, getMe };
