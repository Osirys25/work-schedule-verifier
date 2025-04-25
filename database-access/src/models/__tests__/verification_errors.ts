import {DataTypes} from 'sequelize';
import sequelize from '../database_auth';
import {VerificationErrors} from '../verification_errors';

jest.mock('../database_auth', () => ({
    define: jest.fn().mockReturnValue({
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
    }),
}));

describe('database-access > src > models > VerificationErrors Model', () => {
    it('should define the VerificationErrors model with correct attributes', () => {
        const modelName = 'VerificationErrors';
        const modelBody = {
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
        };

        sequelize.define(modelName, modelBody);

        expect(sequelize.define).toHaveBeenCalledWith(modelName, modelBody);
        expect(VerificationErrors).toEqual(modelBody);
    });
});
