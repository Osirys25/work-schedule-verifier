import {DataTypes} from 'sequelize';

import sequelize from './database_auth';

export const Verification = sequelize.define('Verification', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    is_valid: {
        type: DataTypes.BOOLEAN,
    },
    schedule_sha: {
        type: DataTypes.TEXT,
    },
});
