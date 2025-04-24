import {HttpClient, VerificationDetails} from '../http_client';

// @ts-expect-error exception
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
    })
);

describe('verifier > src > services > HttpClient', () => {
    const path = 'http://example.com';
    const httpClient = new HttpClient(path);

    const verificationDetails: VerificationDetails = {
        is_valid: true,
        schedule_sha: 'abc123',
        errors: [
            {
                employee_name: 'John Doe',
                date: '2023-04-01',
                break_period: '15 minutes',
            },
        ],
    };

    it('should send verification details via POST request', async () => {
        await httpClient.sendVerificationDetails(verificationDetails);

        expect(fetch).toHaveBeenCalledWith(`${path}/verification/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verificationDetails),
        });
    });

    it('should handle empty verification details', async () => {
        const emptyDetails: VerificationDetails = {
            is_valid: false,
            schedule_sha: '',
            errors: [],
        };

        await httpClient.sendVerificationDetails(emptyDetails);

        expect(fetch).toHaveBeenCalledWith(`${path}/verification/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emptyDetails),
        });
    });
});
