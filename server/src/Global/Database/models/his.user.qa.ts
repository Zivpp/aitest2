import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db.js';

const ORM_HisUserQA = sequelize.define('his_user_qa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    trace_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    intend_type: DataTypes.STRING,
    session_id: DataTypes.STRING,

    original_question: DataTypes.TEXT,
    inferred_question: DataTypes.TEXT,

    inferred_keywords: DataTypes.STRING,

    answer: DataTypes.TEXT,
    match_vector_ids: DataTypes.STRING,
    match_rdb_ids: DataTypes.STRING,

    user_info_str: DataTypes.TEXT,

    is_hit: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

    is_valid: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

    is_emergency: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }

}, {
    tableName: 'his_user_qa',

    // ✔ 啟用 Sequelize 自動管理 timestamps
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    // ✔ 建立索引
    indexes: [
        { fields: ['user_id'] },
        { fields: ['intend_type'] },
        { fields: ['session_id'] },
        { fields: ['is_valid'] },
        { fields: ['is_hit'] },
    ]
});

export default ORM_HisUserQA;