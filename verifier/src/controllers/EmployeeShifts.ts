import {EmployeeUtils, ShiftUtils} from '../utils';

/**
 * Represents a work shift.
 * @typedef {Object} Shift
 * @property {string} employee_id - The ID of the employee assigned to the shift.
 * @property {string} start_time - The start time of the shift (ISO 8601 format).
 * @property {string} end_time - The end time of the shift (ISO 8601 format).
 */
export type Shift = {
    employee_id: string;
    start_time: string;
    end_time: string;
};

/**
 * Represents an employee.
 * @typedef {Object} Employee
 * @property {string} id - The ID of the employee.
 * @property {string} first_name - The first name of the employee.
 * @property {string} last_name - The last name of the employee.
 * @property {boolean} flexible_hours - Indicates if the employee has flexible working hours.
 */
export type Employee = {
    id: string;
    first_name: string;
    last_name: string;
    flexible_hours: boolean;
};

/**
 * Represents a violation of the 11-hour rest rule.
 * @typedef {Object} Violation
 * @property {string} employee_name - The name of the employee.
 * @property {string} date - The date of the violation (YYYY-MM-DD).
 * @property {string} details - Details about the violation.
 */
type Violation = {
    employee_name: string;
    date: string;
    break_period: string;
};

/**
 * Represents the output of the schedule validation.
 * @typedef {Object} ScheduleOutput
 * @property {boolean} is_schedule_valid - Indicates if the schedule is valid.
 * @property {Violation[]} violations - List of violations found in the schedule.
 */
export type ScheduleOutput = {
    is_schedule_valid: boolean;
    violations: Violation[];
};

export class EmployeeShifts {
    private shifts: Shift[];
    private employees: Employee[];

    constructor(shifts: Shift[], employees: Employee[]) {
        this.shifts = shifts;
        this.employees = employees;
    }

    private parseViolationResponse(
        employeeId: string,
        date: string,
        breakPeriod: string
    ): Violation {
        return {
            employee_name: EmployeeUtils.getEmployeeName(
                employeeId,
                this.employees
            ),
            date,
            break_period: breakPeriod,
        };
    }

    /**
     * Validates the shifts for a single employee.
     * @param {Shift[]} shifts - The list of shifts for the employee.
     * @param {Employee} employee - The employee object.
     * @returns {Violation[]} The list of violations for the employee.
     */
    private validateEmployeeShifts(
        shifts: Shift[],
        employee: Employee
    ): Violation[] {
        const violations: Violation[] = [];
        const sortedShifts = ShiftUtils.sortShiftsByStartTime(shifts);

        for (let i = 1; i < sortedShifts.length; i++) {
            const restPeriod = ShiftUtils.calculateRestPeriod(
                sortedShifts[i - 1],
                sortedShifts[i]
            );

            if (employee.flexible_hours) {
                const nextShift =
                    i + 1 < sortedShifts.length ? sortedShifts[i + 1] : null;
                const endOfWorkDayRestPeriod =
                    ShiftUtils.calculateEndOfWorkDayRestPeriod(
                        sortedShifts[i],
                        nextShift
                    );

                if (endOfWorkDayRestPeriod < 11) {
                    violations.push(
                        this.parseViolationResponse(
                            employee.id,
                            sortedShifts[i].start_time.split('T')[0],
                            endOfWorkDayRestPeriod.toFixed(2)
                        )
                    );
                }
            } else {
                if (restPeriod < 11) {
                    violations.push(
                        this.parseViolationResponse(
                            employee.id,
                            sortedShifts[i].start_time.split('T')[0],
                            restPeriod.toFixed(2)
                        )
                    );
                }
            }
        }

        return violations;
    }

    /**
     * Validates the schedule to ensure compliance with the 11-hour rest rule.
     * @returns {ScheduleOutput} The result of the schedule validation.
     */
    public validate(): ScheduleOutput {
        const violations: Violation[] = [];
        const employeeShifts = ShiftUtils.groupShiftsByEmployee(this.shifts);

        for (const employeeId in employeeShifts) {
            const shifts = employeeShifts[employeeId];
            const employee = this.employees.find(emp => emp.id === employeeId);
            if (!employee) continue;

            const employeeViolations = this.validateEmployeeShifts(
                shifts,
                employee
            );
            violations.push(...employeeViolations);
        }

        return {
            is_schedule_valid: violations.length === 0,
            violations: violations,
        };
    }
}
