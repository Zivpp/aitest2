import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    'AITest', 'postgres', '033611036',
    {
        host: '127.0.0.1',
        dialect: 'postgres',
        logging: false, // 關掉 SQL log (可開啟除錯)
    });

export default sequelize;
