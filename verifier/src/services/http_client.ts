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

/**
 * @typedef {Object} VerificationDetails
 * @property {boolean} is_valid - Indicates if the verification is valid.
 * @property {string} schedule_sha - SHA of the schedule.
 * @property {VerificationError[]} errors - List of verification errors.
 */
export type VerificationDetails = {
    is_valid: boolean;
    schedule_sha: string;
    errors: VerificationError[];
};

/**
 * Class representing an HTTP client.
 */
export class HttpClient {
    /**
     * The base path for the HTTP client.
     * @type {string}
     */
    path: string;

    /**
     * Creates an instance of HttpClient.
     * @param {string} path - The base path for the HTTP client.
     */
    constructor(path: string) {
        this.path = path;
    }

    /**
     * Sends verification details to the server.
     * @param {VerificationDetails} verificationDetails - The verification details to send.
     * @returns {Promise<void>} A promise that resolves when the verification details are sent.
     */
    async sendVerificationDetails(verificationDetails: VerificationDetails) {
        await fetch(`${this.path}/verification/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verificationDetails),
        });
    }
}
