import {Verification} from '../models/verification';
import {Model} from 'sequelize';

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
}

export const verificationService = new VerificationService();
