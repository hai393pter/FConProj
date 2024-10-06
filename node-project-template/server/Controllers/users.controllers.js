import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';



const register = async (req, res) => {
    const { name, email, password } = req.body; // Ensure to use 'name'

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ name, email, password_hash });
        return res.status(201).json({ message: "User registered successfully.", userId: newUser.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error registering user.", error: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body; // Ensure email and password are sent in the request body

    try {
        console.log('Login request received'); 
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Log the user object to see its contents
        console.log("User found:", user);

        // Ensure the password_hash exists
        const passwordHash = user.password_hash; // Make sure this field exists
        if (!passwordHash) {
            return res.status(500).json({ message: "User found but no password hash exists." });
        }

        const isPasswordValid = await bcrypt.compare(password, passwordHash);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Optionally, generate a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Error logging in.", error: error.message });
    }
};

// Get the currently logged-in user
const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id); // Assuming you're using a middleware to set req.user
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ username: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user data.', error: err.message });
    }
};

// Export functions
export default { register, login, getMe };