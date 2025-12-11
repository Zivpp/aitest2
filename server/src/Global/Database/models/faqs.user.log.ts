// models/fqas_user_log.model.ts
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const FaqsUserLog = sequelize.define('FaqsUserLog', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_info_str: {
        type: DataTypes.TEXT, // 資訊可能偏長，用 TEXT 比較安全
        allowNull: true
    },
    original_question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    inferred_question: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    inferred_keywords: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    vector_id_str: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rdb_id_str: {
        type: DataTypes.STRING,
        allowNull: true
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_hit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,   // 1=成功命中, 0=未命中
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'faqs_user_logs',
    timestamps: false, // 因為你手動設定欄位
    underscored: true
});

export default FaqsUserLog;
