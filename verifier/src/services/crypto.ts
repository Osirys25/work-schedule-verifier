import {createHash} from 'crypto';

export class CryptoVerificationDetails {
    static processSchedule(schedule: string): string {
        return createHash('sha256').update(schedule).digest('base64');
    }
}
