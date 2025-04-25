import express from 'express';
import request from 'supertest';
import router from '../verification';

const mockGetAllVerifications = jest.fn();
const mockAddVerification = jest.fn();

jest.mock('../../db_services', () => ({
    verificationService: {
        addNewVerification: (test1, test2) => mockAddVerification(test1, test2),
        getAllVerifications: (test1, test2) =>
            mockGetAllVerifications(test1, test2),
    },
}));

const app = express();
app.use(express.json());
app.use('/verifications', router);

describe('database-access > src > api > Verification Router', () => {
    describe('POST /verifications', () => {
        it('should return 400 if request body is missing', async () => {
            const response = await request(app).post('/verifications').send({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'Bad Request: Missing or empty required parameters'
            );
        });

        it('should return 400 if required parameters are missing', async () => {
            const response = await request(app)
                .post('/verifications')
                .send({is_valid: true});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'Bad Request: Missing or empty required parameters'
            );
        });

        it('should return 200 and call addNewVerification with correct data', async () => {
            const data = {is_valid: true, schedule_sha: 'sha256', errors: []};
            const response = await request(app)
                .post('/verifications')
                .send(data);
            expect(response.status).toBe(200);
            expect(mockAddVerification).toHaveBeenCalledWith(
                {is_valid: true, schedule_sha: 'sha256'},
                []
            );
        });
    });

    describe('GET /verifications', () => {
        it('should return 400 if required query parameters are missing', async () => {
            const response = await request(app).get('/verifications').query({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'Bad Request: Missing or empty required parameters'
            );
        });

        it('should return 200 and call getAllVerifications with correct parameters', async () => {
            mockGetAllVerifications.mockResolvedValue([]);
            const response = await request(app)
                .get('/verifications')
                .query({limit: 10, offset: 0});
            expect(response.status).toBe(200);
            expect(mockGetAllVerifications).toHaveBeenCalledWith('10', '0');
            expect(response.body).toEqual([]);
        });
    });
});
