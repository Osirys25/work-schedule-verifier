import {Shift} from '../controllers';

export class ShiftUtils {
    /**
     * Groups shifts by employee.
     * @param {Shift[]} shifts - The list of shifts.
     * @returns {Record<string, Shift[]>} The grouped shifts by employee ID.
     */
    static groupShiftsByEmployee(shifts: Shift[]): Record<string, Shift[]> {
        const employeeShifts: {[key: string]: Shift[]} = {};
        shifts.forEach(shift => {
            if (!employeeShifts[shift.employee_id]) {
                employeeShifts[shift.employee_id] = [];
            }
            employeeShifts[shift.employee_id].push(shift);
        });
        return employeeShifts;
    }

    /**
     * Sorts shifts by start time.
     * @param {Shift[]} shifts - The list of shifts.
     * @returns {Shift[]} The sorted shifts.
     */
    static sortShiftsByStartTime(shifts: Shift[]): Shift[] {
        return shifts.sort(
            (a, b) =>
                new Date(a.start_time).getTime() -
                new Date(b.start_time).getTime()
        );
    }

    /**
     * Calculates the rest period between two shifts.
     * @param {Shift} previousShift - The previous shift.
     * @param {Shift} currentShift - The current shift.
     * @returns {number} The rest period in hours.
     */
    static calculateRestPeriod(
        previousShift: Shift,
        currentShift: Shift
    ): number {
        const previousShiftEnd = new Date(previousShift.end_time).getTime();
        const currentShiftStart = new Date(currentShift.start_time).getTime();
        return (currentShiftStart - previousShiftEnd) / (1000 * 60 * 60);
    }

    /**
     * Calculates the rest period at the end of the workday for flexible hours.
     * @param {Shift} currentShift - The current shift.
     * @param {Shift | null} nextShift - The next shift.
     * @returns {number} The rest period in hours.
     */
    static calculateEndOfWorkDayRestPeriod(
        currentShift: Shift,
        nextShift: Shift | null
    ): number {
        const currentShiftStart = new Date(currentShift.start_time).getTime();
        const nextShiftStart = nextShift
            ? new Date(nextShift.start_time).getTime()
            : null;
        const workDayEnd =
            nextShiftStart &&
            nextShiftStart < currentShiftStart + 24 * 60 * 60 * 1000
                ? nextShiftStart
                : currentShiftStart + 24 * 60 * 60 * 1000;
        return (workDayEnd - currentShiftStart) / (1000 * 60 * 60);
    }
}
