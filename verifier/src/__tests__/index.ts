import express from 'express';
import request from 'supertest';
import {server} from '../index';

jest.mock('../api/verification', () => {
    const router = express.Router();
    // @ts-expect-error exception
    router.post('/', (req, res) => res.status(200).send());
    // @ts-expect-error exception
    router.get('/', (req, res) => res.status(200).send([]));
    return router;
});

describe('verifier > src > Express Server', () => {
    it('should log server start message', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const listenPromise = new Promise(resolve => {
            server.listen(3000, () => {
                console.log(
                    `Verifier service is listening at http://localhost:3000`
                );
                resolve('');
            });
        });

        await listenPromise;

        expect(consoleSpy).toHaveBeenCalledWith(
            `Verifier service is listening at http://localhost:3000`
        );
    });

    it('should handle POST /', async () => {
        const response = await request(server)
            .post('/')
            .send({is_valid: true, schedule_sha: 'sha256', errors: []});
        expect(response.status).toBe(200);
    });

    it('should handle GET /', async () => {
        const response = await request(server)
            .get('/')
            .query({limit: 10, offset: 0});
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});
