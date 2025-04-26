import {Model} from 'sequelize';
import {VerificationErrors} from '../models/verification_errors';

class VerificationErrorsService {
    /**
     * Initializes the VerificationErrors model by syncing it with the database.
     * @returns {Promise<Model>} The synced VerificationErrors model.
     */
    async init(): Promise<Model> {
        return VerificationErrors.sync({force: false, alter: true});
    }
}

export const verificationErrorService = new VerificationErrorsService();
