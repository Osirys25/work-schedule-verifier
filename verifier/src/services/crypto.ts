import {createHash} from 'crypto';

/**
 * Class for processing verification details using cryptographic methods.
 */
export class CryptoVerificationDetails {
    /**
     * Processes a schedule string and returns its SHA-256 hash encoded in base64.
     * @param {string} schedule - The schedule string to be hashed.
     * @returns {string} The base64-encoded SHA-256 hash of the schedule.
     */
    static processSchedule(schedule: string): string {
        return createHash('sha256').update(schedule).digest('base64');
    }
}
