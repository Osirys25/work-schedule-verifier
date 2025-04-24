import {ShiftUtils} from '../ShiftUtils';
import {Shift} from '../../controllers';

describe('verifier > src > utils > ShiftUtils', () => {
    const shifts: Shift[] = [
        {
            employee_id: '1',
            start_time: '2023-04-01T08:00:00Z',
            end_time: '2023-04-01T16:00:00Z',
        },
        {
            employee_id: '1',
            start_time: '2023-04-02T08:00:00Z',
            end_time: '2023-04-02T16:00:00Z',
        },
        {
            employee_id: '2',
            start_time: '2023-04-01T09:00:00Z',
            end_time: '2023-04-01T17:00:00Z',
        },
    ];

    it('should calculate rest period between two shifts', () => {
        const restPeriod = ShiftUtils.calculateRestPeriod(shifts[0], shifts[1]);
        expect(restPeriod).toBe(16); // 16 hours between shifts
    });

    it('should calculate end of workday rest period', () => {
        const restPeriod = ShiftUtils.calculateEndOfWorkDayRestPeriod(
            shifts[0],
            shifts[1]
        );
        expect(restPeriod).toBe(24); // 24 hours rest period
    });

    it('should group shifts by employee', () => {
        const groupedShifts = ShiftUtils.groupShiftsByEmployee(shifts);
        expect(groupedShifts['1']).toHaveLength(2);
        expect(groupedShifts['2']).toHaveLength(1);
    });

    it('should sort shifts by start time', () => {
        const sortedShifts = ShiftUtils.sortShiftsByStartTime(shifts);
        expect(sortedShifts[0].start_time).toBe('2023-04-01T08:00:00Z');
        expect(sortedShifts[1].start_time).toBe('2023-04-01T09:00:00Z');
        expect(sortedShifts[2].start_time).toBe('2023-04-02T08:00:00Z');
    });

    it('should calculate end of workday rest period with no next shift', () => {
        const restPeriod = ShiftUtils.calculateEndOfWorkDayRestPeriod(
            shifts[0],
            null
        );
        expect(restPeriod).toBe(24); // 24 hours rest period
    });
});
