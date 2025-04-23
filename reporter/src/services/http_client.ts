export class HttpClient {
    path: string;

    constructor(path: string) {
        this.path = path;
    }

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

        console.log(res);

        return res.json();
    }
}
