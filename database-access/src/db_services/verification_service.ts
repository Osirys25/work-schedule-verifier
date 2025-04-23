import {Verification} from '../models/verification';
import {Model} from 'sequelize';
import {VerificationErrors} from '../models/verification_errors';

type VerificationDetails = {
    is_valid: boolean;
    schedule_sha: string;
};

class VerificationService {
    async init(): Promise<Model> {
        return Verification.sync({force: true});
    }

    async addNewVerification(data: VerificationDetails): Promise<void> {
        await Verification.create({
            ...data,
        });
    }

    async getAllVerifications(limit: number, offset: number): Promise<any> {
        return await Verification.findAll({
            include: [
                {
                    model: VerificationErrors,
                    as: 'verificationErrors', // Use the alias defined in the association
                },
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
    }
}

export const verificationService = new VerificationService();
