import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';

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
        return res.status(200).json({
            statusCode: 200,
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

        // Return response with id, username, and email
        return res.status(200).json({
            statusCode: 200,
            message: "Login successful",
            data: {
                token,
                id: user.id,
                username: user.name, 
                email: user.email
            }
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
                message: 'Không tìm thấy người dùng',
                data: {}
            });
        }

        res.status(200).json({
            statusCode: 200,
            message: "Thông tin người dùng đã được lấy thành công",
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

//Change password
export const changePassword = async (req, res) => {
    const { id } = req.user; // Use req.user.id instead of user_id
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(id); // Use id to find user

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Không tìm thấy người dùng'
            });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Mật khẩu cũ không đúng'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password_hash = hashedPassword;
        await user.save();

        return res.status(200).json({
            statusCode: 200,
            message: 'Mật khẩu đã được đổi thành công!'
        });
    } catch (error) {
        console.error('Có lỗi khi đổi mật khẩu:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Server error',
            error: error.message
        });
    }
};

// Forgot password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User not found with this email'
            });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        user.reset_password_token = resetToken;
        user.reset_password_expires = tokenExpiry;
        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `Hãy nhấp vào liên kết bên dưới để tiến hành khôi phục mật khẩu: \n\n 
            https://pex-api.arisavinh.dev/users/reset-password?token=${resetToken} \n\n
            Liên kết này sẽ hết hạn sau 1h.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({
                    statusCode: 500,
                    message: 'Error sending email',
                    error: error.message // Ghi lại lỗi chi tiết
                });
            }
        
            console.log('Email sent:', info.response); // Ghi log phản hồi từ Gmail
            return res.status(200).json({
                statusCode: 200,
                message: 'Liên kết đặt lại mật khẩu đã được gửi đến hòm thư của bạn'
            });
        });
    } catch (error) {
        console.error('Error in forgot password:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Server error',
            error: error.message
        });
    }
};


  

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            where: {
                reset_password_token: token,
                reset_password_expires: { [Op.gt]: Date.now() } // Check if token is not expired
            }
        });

        if (!user) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token fields
        user.password_hash = hashedPassword;
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();

        return res.status(200).json({
            statusCode: 200,
            message: 'Mật khẩu đã được đặt lại thành công'
        });
    } catch (error) {
        console.error('Có lỗi khi đặt lại mật khẩu:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Server error',
            error: error.message
        });
    }
};


//Update information
  export const updateUserInfo = async (req, res) => {
    const { id } = req.user; // Assuming userId is stored in JWT
    const { name, email, address, phone } = req.body; // Example fields to update
  
    try {
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Không tìm thấy người dùng'
        });
      }
  
      // Update fields
      user.name = name || user.name;
      user.email = email || user.email;
  
      await user.save();
  
      return res.status(200).json({
        statusCode: 200,
        message: 'Thông tin người dùng đã được cập nhật thành công',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Có lỗi khi cập nhật thông tin người dùng:', error);
      return res.status(500).json({
        statusCode: 500,
        message: 'Server error',
        error: error.message
      });
    }
  };
// Export functions
export default { register, login, getMe,changePassword,
    forgotPassword,
    resetPassword,
    updateUserInfo };
