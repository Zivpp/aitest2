// models/fqas_user_log.model.ts
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const FaqsUserLog = sequelize.define('FaqsUserLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // nextval 對應 autoIncrement
        primaryKey: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    event_type: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    event_message_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    event_json_str: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_displayname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_picture_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_json_str: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    gpt_user_q_keywords_prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    gpt_user_q_keywords_str: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    gpt_vector_search_result_json_str: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    gpt_answer_prompt: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    gpt_answer: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'faqs_user_log',
    timestamps: false, // 因為手動有 created_at / updated_at
});

export default FaqsUserLog;
