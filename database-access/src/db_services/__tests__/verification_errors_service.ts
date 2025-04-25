import {VerificationErrors} from '../../models/verification_errors';
import {verificationErrorService} from '../verification_errors_service';

jest.mock('../../models/verification_errors', () => ({
    VerificationErrors: {
        sync: jest.fn(),
    },
}));

describe('database-access > src > db_services > VerificationErrorsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        it('should sync the VerificationErrors model', async () => {
            await verificationErrorService.init();
            expect(VerificationErrors.sync).toHaveBeenCalledWith({force: true});
        });
    });
});
