import {DataTypes} from 'sequelize';

import sequelize from './database_auth';

export const VerificationErrors = sequelize.define('VerificationErrors', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    employee_name: {
        type: DataTypes.TEXT,
    },
    date: {
        type: DataTypes.TEXT,
    },
    break_period: {
        type: DataTypes.TEXT,
    },
});
