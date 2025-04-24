import {Model} from 'sequelize';
import {VerificationErrors} from '../models/verification_errors';

class VerificationErrorsService {
    async init(): Promise<Model> {
        return VerificationErrors.sync({force: true});
    }
}

export const verificationErrorService = new VerificationErrorsService();
