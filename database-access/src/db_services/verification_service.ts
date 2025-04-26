import {Verification} from '../models/verification';
import {Model} from 'sequelize';
import {VerificationErrors} from '../models/verification_errors';

/**
 * @typedef {Object} VerificationDetails
 * @property {boolean} is_valid - Indicates if the verification is valid.
 * @property {string} schedule_sha - SHA of the schedule.
 */
type VerificationDetails = {
    is_valid: boolean;
    schedule_sha: string;
};

/**
 * @typedef {Object} VerificationError
 * @property {string} employee_name - Name of the employee.
 * @property {string} date - Date of the error.
 * @property {string} break_period - Period of the break.
 */
type VerificationError = {
    employee_name: string;
    date: string;
    break_period: string;
};

class VerificationService {
    /**
     * Initializes the Verification model by syncing it with the database.
     * @returns {Promise<Model>} The synced Verification model.
     */
    async init(): Promise<Model> {
        return Verification.sync({force: false, alter: true});
    }

    /**
     * Adds a new verification entry to the database.
     * @param {VerificationDetails} data - The details of the verification.
     * @param {VerificationError[]} errors - The list of verification errors.
     * @returns {Promise<void>} A promise that resolves when the verification is added.
     */
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

    /**
     * Retrieves all verification entries from the database with pagination.
     * @param {number} limit - The maximum number of entries to retrieve.
     * @param {number} offset - The number of entries to skip.
     * @returns {Promise<any>} A promise that resolves with the list of verification entries.
     */
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
