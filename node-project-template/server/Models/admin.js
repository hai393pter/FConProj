import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../database.js'; // Đảm bảo đường dẫn đúng đến file cấu hình database

class Admin extends Model {
  // Phương thức để kiểm tra mật khẩu đã băm
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
      // Hook trước khi lưu admin, mã hóa mật khẩu
      beforeCreate: async (admin) => {
        if (admin.password_hash) {
          const salt = await bcrypt.genSalt(10);
          admin.password_hash = await bcrypt.hash(admin.password_hash, salt);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.password_hash) {
          const salt = await bcrypt.genSalt(10);
          admin.password_hash = await bcrypt.hash(admin.password_hash, salt);
        }
      }
    }
  }
);

export default Admin;
