import bcrypt from 'bcrypt';
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
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
      
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin
    const newAdmin = await Admin.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    return res.status(201).json({ message: 'Admin registered successfully', adminId: newAdmin.id });
  } catch (error) {
    console.error('Error registering admin:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login an admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Password provided by user:', password);
    console.log('Hashed password in DB:', admin.password_hash);

    // Check if password matches
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    return res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current logged-in admin info (getMe)
export const getMe = async (req, res) => {
  try {
    // `req.admin` will be available if the user is authenticated
    const admin = await Admin.findByPk(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role, // Assuming you have a 'role' field in the admin model
    });
  } catch (error) {
    console.error('Error fetching admin info:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all controllers
export default { registerAdmin, loginAdmin, getMe };
