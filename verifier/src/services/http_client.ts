type VerificationError = {
    employee_name: string;
    date: string;
    break_period: string;
};

type VerificationDetails = {
    is_valid: boolean;
    schedule_sha: string;
    errors: VerificationError[];
};

export class HttpClient {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

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
