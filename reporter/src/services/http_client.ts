export class HttpClient {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

    async getVerificationDetails() {
        const res = await fetch(`${this.path}/verification/`, {
            method: 'GET',
        });

        return res.json();
    }
}
