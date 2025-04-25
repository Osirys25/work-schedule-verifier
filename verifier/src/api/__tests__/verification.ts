import express from 'express';
import request from 'supertest';
import router from '../verification';
import {EmployeeShifts} from '../../controllers';
import {HttpClient} from '../../services';
import {CryptoVerificationDetails} from '../../services/crypto';

jest.mock('../../controllers', () => ({
    EmployeeShifts: jest.fn().mockImplementation(() => ({
        validate: jest.fn().mockReturnValue({
            is_schedule_valid: true,
            violations: [],
        }),
    })),
}));

jest.mock('../../services', () => ({
    HttpClient: jest.fn().mockImplementation(() => ({
        sendVerificationDetails: jest.fn(),
    })),
}));

jest.mock('../../services/crypto', () => ({
    CryptoVerificationDetails: {
        processSchedule: jest.fn().mockReturnValue('mocked_schedule_sha'),
    },
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('verifier > src > api > Verification Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /check/', () => {
        it('should return 400 if request body is missing', async () => {
            const response = await request(app).post('/check/').send({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'Bad Request: Missing or empty employees or employeeShifts'
            );
        });

        it('should return 400 if employees or employeeShifts are missing', async () => {
            const response = await request(app)
                .post('/check/')
                .send({employees: [], employeeShifts: []});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'Bad Request: Missing or empty employees or employeeShifts'
            );
        });

        it('should return 200 and validate employee shifts', async () => {
            const requestBody = {
                employees: [
                    {
                        id: '1',
                        first_name: 'John',
                        last_name: 'Doe',
                        flexible_hours: true,
                    },
                ],
                employeeShifts: [
                    {
                        employee_id: '1',
                        start_time: '2025-04-25T08:00:00Z',
                        end_time: '2025-04-25T16:00:00Z',
                    },
                ],
            };

            const response = await request(app)
                .post('/check/')
                .send(requestBody);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                is_schedule_valid: true,
                violations: [],
            });

            expect(EmployeeShifts).toHaveBeenCalledWith(
                requestBody.employeeShifts,
                requestBody.employees
            );
            expect(
                CryptoVerificationDetails.processSchedule
            ).toHaveBeenCalledWith(JSON.stringify(requestBody));
            expect(HttpClient).toHaveBeenCalledWith(
                process.env.DATABASE_ACCESS_PATH
            );
        });
    });
});
