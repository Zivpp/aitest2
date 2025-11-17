import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db.js';

const Faq = sequelize.define('Faq', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    keywords: {
        type: DataTypes.TEXT,  // PostgreSQL 原生陣列
        allowNull: true,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'faqs',
    timestamps: false, // 不用 Sequelize 預設 createdAt/updatedAt
});

export default Faq;
