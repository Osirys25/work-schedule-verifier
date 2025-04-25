import express from 'express';
import request from 'supertest';
import {server} from '../index';

jest.mock('../api/history', () => {
    const router = express.Router();
    // @ts-expect-error exception
    router.get('/', (req, res) => res.status(200).send([]));
    return router;
});

describe('reporter > src > Express Server', () => {
    it('should log server start message', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const listenPromise = new Promise(resolve => {
            server.listen(3000, () => {
                console.log(
                    `Database-access - express is listening at http://localhost:3000`
                );
                resolve('');
            });
        });

        await listenPromise;

        expect(consoleSpy).toHaveBeenCalledWith(
            `Database-access - express is listening at http://localhost:3000`
        );
    });

    it('should handle GET /history/', async () => {
        const response = await request(server).get('/history/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});
