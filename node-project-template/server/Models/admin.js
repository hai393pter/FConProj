import { DataTypes, Model } from 'sequelize';
import argon2 from 'argon2';
import sequelize from '../database.js'; // Đảm bảo đường dẫn đúng đến file cấu hình database

class Admin extends Model {
  // Method to check password using bcrypt
  static async checkPassword(password, hashedPassword) {
    return await argon2.verify(hashedPassword, password);

  }
}

Admin.init(
  {
    // Định nghĩa các cột trong bảng
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'superadmin'),
      defaultValue: 'admin'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins', // Tên bảng trong cơ sở dữ liệu
    hooks: {
      // Hook before creating a new admin (hash password only if it's not already hashed)
      beforeCreate: async (admin) => {
        if (admin.password_hash && !admin.password_hash.startsWith('$argon2')) {
          admin.password_hash = await argon2.hash(admin.password_hash);
        }
      },
      // Hook before updating an existing admin (hash password only if it's not already hashed)
      beforeUpdate: async (admin) => {
        if (admin.password_hash && !admin.password_hash.startsWith('$argon2')) {
          admin.password_hash = await argon2.hash(admin.password_hash);
        }
      }
    }
  }
);

export default Admin;
