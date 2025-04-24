import {Verification} from '../models/verification';
import {Model} from 'sequelize';
import {VerificationErrors} from '../models/verification_errors';

type VerificationDetails = {
    is_valid: boolean;
    schedule_sha: string;
};

type VerificationError = {
    employee_name: string;
    date: string;
    details: string;
};

class VerificationService {
    async init(): Promise<Model> {
        return Verification.sync({force: true});
    }

    async addNewVerification(
        data: VerificationDetails,
        errors: VerificationError[]
    ): Promise<void> {
        await Verification.create(
            {
                ...data,
                violations: errors,
            },
            {
                include: [
                    {
                        model: VerificationErrors,
                        as: 'violations',
                    },
                ],
            }
        );
    }

    async getAllVerifications(limit: number, offset: number): Promise<any> {
        return await Verification.findAll({
            include: [
                {
                    model: VerificationErrors,
                    as: 'violations',
                    attributes: ['employee_name', 'date', 'break_period'],
                },
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            attributes: ['uuid', 'is_valid', 'createdAt', 'schedule_sha'],
        });
    }
}

export const verificationService = new VerificationService();
