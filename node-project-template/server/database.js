import { Sequelize } from "sequelize";

// Thay thế thông tin dưới đây với giá trị thực tế của bạn
const sequelize = new Sequelize('qldb', 'FConnectAdmin', 'FConnectRoot', {
    host: 'localhost',
    dialect: 'mysql',
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Kết nối đến cơ sở dữ liệu thành công.');
    } catch (error) {
        console.error('Không thể kết nối đến cơ sở dữ liệu:', error);
    }
}

export default sequelize;
