import {CryptoVerificationDetails} from '../crypto';

const mockCreateHash = jest.fn().mockImplementation(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => 'mocked_hash'),
}));

jest.mock('crypto', () => ({
    createHash: (test: string) => mockCreateHash(test),
}));

describe('verifier > src > services > CryptoVerificationDetails', () => {
    test('should process schedule and return hashed value', () => {
        const schedule = 'test_schedule';
        const hashedValue = CryptoVerificationDetails.processSchedule(schedule);

        expect(mockCreateHash).toHaveBeenCalledWith('sha256');
        expect(hashedValue).toBe('mocked_hash');
    });
});
