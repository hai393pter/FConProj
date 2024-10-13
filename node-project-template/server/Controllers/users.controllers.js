import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                statusCode: 400,
                message: "User already exists.",
                data: {}
            });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ name, email, password_hash });
        return res.status(201).json({
            statusCode: 201,
            message: "User registered successfully.",
            data: { userId: newUser.id }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            message: "Error registering user.",
            data: { error: error.message }
        });
    }
};

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login request received'); 
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                statusCode: 401,
                message: "Invalid email or password.",
                data: {}
            });
        }

        // Log the user object to see its contents
        console.log("User found:", user);

        // Ensure the password_hash exists
        const passwordHash = user.password_hash; 
        if (!passwordHash) {
            return res.status(500).json({
                statusCode: 500,
                message: "User found but no password hash exists.",
                data: {}
            });
        }

        const isPasswordValid = await bcrypt.compare(password, passwordHash);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                message: "Invalid email or password.",
                data: {}
            });
        }

        // Optionally, generate a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            statusCode: 200,
            message: "Login successful",
            data: { token }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Error logging in.",
            data: { error: error.message }
        });
    }
};

// Get the currently logged-in user
const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id); 
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User not found.',
                data: {}
            });
        }

        res.status(200).json({
            statusCode: 200,
            message: "User information retrieved successfully.",
            data: {
                username: user.name,
                email: user.email,
                id: user.id
            }
        });
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            message: 'Error fetching user data.',
            data: { error: err.message }
        });
    }
};

// Export functions
export default { register, login, getMe };
