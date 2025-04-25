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
     * Fetches verification details from the server.
     * @param {string} limit - The maximum number of entries to retrieve.
     * @param {string} offset - The number of entries to skip.
     * @returns {Promise<any>} A promise that resolves to the verification details.
     */
    async getVerificationDetails(limit: string, offset: string) {
        const res = await fetch(
            `${this.path}/verification/?` +
                new URLSearchParams({
                    limit,
                    offset,
                }),
            {
                method: 'GET',
            }
        );

        return res.json();
    }
}
