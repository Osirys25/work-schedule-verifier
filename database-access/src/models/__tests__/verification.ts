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
        is_valid: {
            type: DataTypes.BOOLEAN,
        },
        schedule_sha: {
            type: DataTypes.TEXT,
        },
        hasMany: jest.fn(),
    }),
}));

jest.mock('../verification_errors', () => ({
    // Mock the VerificationErrors model as needed
}));

describe('database-access > src > models > Verification Model', () => {
    it('should define the Verification model with correct attributes', () => {
        const modelName = 'Verification';
        const modelBody = {
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
        };

        sequelize.define(modelName, modelBody);

        expect(sequelize.define).toHaveBeenCalledWith(modelName, modelBody);
    });

    it('should set up the association with VerificationErrors', () => {
        const Verification = sequelize.define('', {});
        Verification.hasMany(VerificationErrors, {
            foreignKey: 'verification_ref',
            as: 'violations',
        });
        expect(Verification.hasMany).toHaveBeenCalledWith(VerificationErrors, {
            foreignKey: 'verification_ref',
            as: 'violations',
        });
    });
});
