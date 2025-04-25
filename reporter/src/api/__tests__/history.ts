import express from 'express';
import request from 'supertest';
import router from '../history';
import {HttpClient} from '../../services';

const mockgetVerificationDetails = jest.fn();

jest.mock('../../services', () => ({
    HttpClient: jest.fn().mockImplementation(() => ({
        getVerificationDetails: mockgetVerificationDetails,
    })),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('reporter > src > api > Verification Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return 400 if required query parameters are missing', async () => {
            const response = await request(app).get('/').query({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'Bad Request: Missing or empty required parameters'
            );
        });

        it('should return 400 if query parameters are not numbers', async () => {
            const response = await request(app)
                .get('/')
                .query({limit: 'abc', offset: 'xyz'});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'Bad Request: Missing or empty required parameters'
            );
        });

        it('should return 200 and fetch verification details', async () => {
            mockgetVerificationDetails.mockResolvedValue([
                {
                    uuid: '70d26182-d053-4318-869d-0e18748e3963',
                    is_valid: false,
                    schedule_sha:
                        'wTNYVs+QYZw5bK/V43zKSOVVjhUs0ReyXBY/IAMyTgY=',
                    createdAt: '2025-04-24T06:12:47.170Z',
                    updatedAt: '2025-04-24T06:12:47.170Z',
                    violations: [
                        {
                            employee_name: 'Tomasz Lewandowski',
                            date: '2025-04-24',
                            details:
                                'The break between shifts was only 9.00 hours.',
                        },
                    ],
                },
            ]);

            const response = await request(app)
                .get('/')
                .query({limit: '10', offset: '0'});
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    uuid: '70d26182-d053-4318-869d-0e18748e3963',
                    is_valid: false,
                    schedule_sha:
                        'wTNYVs+QYZw5bK/V43zKSOVVjhUs0ReyXBY/IAMyTgY=',
                    createdAt: '2025-04-24T06:12:47.170Z',
                    updatedAt: '2025-04-24T06:12:47.170Z',
                    violations: [
                        {
                            employee_name: 'Tomasz Lewandowski',
                            date: '2025-04-24',
                            details:
                                'The break between shifts was only 9.00 hours.',
                        },
                    ],
                },
            ]);

            expect(HttpClient).toHaveBeenCalledWith(
                process.env.DATABASE_ACCESS_PATH
            );
            expect(mockgetVerificationDetails).toHaveBeenCalledWith('10', '0');
        });
    });
});
