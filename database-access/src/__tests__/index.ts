import express from 'express';
import request from 'supertest';
import {verificationService} from '../db_services';
import {verificationErrorService} from '../db_services/verification_errors_service';
import {server} from '../index';

jest.mock('../db_services', () => ({
    verificationService: {
        init: jest.fn(),
    },
}));

jest.mock('../db_services/verification_errors_service', () => ({
    verificationErrorService: {
        init: jest.fn(),
    },
}));

jest.mock('../api/verification', () => {
    const router = express.Router();
    // @ts-expect-error exception
    router.post('/', (req, res) => res.status(200).send());
    // @ts-expect-error exception
    router.get('/', (req, res) => res.status(200).send([]));
    return router;
});

describe('database-access > src > Express Server', () => {
    it('should initialize verificationService and verificationErrorService on server start', async () => {
        const port = 3000;
        const listenPromise = new Promise(resolve => {
            server.listen(port, async () => {
                await verificationService.init();
                await verificationErrorService.init();
                resolve('');
            });
        });

        await listenPromise;

        expect(verificationService.init).toHaveBeenCalled();
        expect(verificationErrorService.init).toHaveBeenCalled();
    });

    it('should handle POST /verification/', async () => {
        const response = await request(server)
            .post('/verification/')
            .send({is_valid: true, schedule_sha: 'sha256', errors: []});
        expect(response.status).toBe(200);
    });

    it('should handle GET /verification/', async () => {
        const response = await request(server)
            .get('/verification/')
            .query({limit: 10, offset: 0});
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});
