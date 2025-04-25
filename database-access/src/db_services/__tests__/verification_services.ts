import {Verification} from '../../models/verification';
import {VerificationErrors} from '../../models/verification_errors';
import {verificationService} from '../verification_service';

jest.mock('../../models/verification', () => ({
    Verification: {
        sync: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
    },
}));

jest.mock('../../models/verification_errors', () => ({
    VerificationErrors: jest.fn(),
}));

describe('database-access > src > db_services > VerificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        it('should sync the Verification model', async () => {
            await verificationService.init();
            expect(Verification.sync).toHaveBeenCalledWith({force: true});
        });
    });

    describe('addNewVerification', () => {
        it('should create a new verification with errors', async () => {
            const data = {is_valid: true, schedule_sha: 'sha256'};
            const errors = [
                {
                    employee_name: 'John Doe',
                    date: '2025-04-25',
                    break_period: '9.00',
                },
            ];

            await verificationService.addNewVerification(data, errors);

            expect(Verification.create).toHaveBeenCalledWith(
                {
                    ...data,
                    violations: errors,
                },
                {
                    include: [
                        {
                            model: VerificationErrors,
                            as: 'violations',
                        },
                    ],
                }
            );
        });
    });

    describe('getAllVerifications', () => {
        it('should retrieve all verifications with pagination', async () => {
            const limit = 10;
            const offset = 0;

            await verificationService.getAllVerifications(limit, offset);

            expect(Verification.findAll).toHaveBeenCalledWith({
                include: [
                    {
                        model: VerificationErrors,
                        as: 'violations',
                        attributes: ['employee_name', 'date', 'break_period'],
                    },
                ],
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                attributes: ['uuid', 'is_valid', 'createdAt', 'schedule_sha'],
            });
        });
    });
});
