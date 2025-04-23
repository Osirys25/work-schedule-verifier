/**
 * Represents a work shift.
 * @typedef {Object} Shift
 * @property {string} employee_id - The ID of the employee assigned to the shift.
 * @property {string} start_time - The start time of the shift (ISO 8601 format).
 * @property {string} end_time - The end time of the shift (ISO 8601 format).
 */
type Shift = {
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
type Employee = {
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
    details: string;
};

/**
 * Represents the output of the schedule validation.
 * @typedef {Object} ScheduleOutput
 * @property {boolean} is_schedule_valid - Indicates if the schedule is valid.
 * @property {Violation[]} violations - List of violations found in the schedule.
 */
type ScheduleOutput = {
    is_schedule_valid: boolean;
    violations: Violation[];
};

export class EmployeeShifts {
    private shifts: Shift[];
    private employees: Employee[];

    /**
     * Creates an instance of EmployeeShifts.
     * @param {Shift[]} shifts - The list of shifts.
     * @param {Employee[]} employees - The list of employees.
     */
    constructor(shifts: Shift[], employees: Employee[]) {
        this.shifts = shifts;
        this.employees = employees;
    }

    /**
     * Gets the name of an employee by their ID.
     * @param {string} employeeId - The ID of the employee.
     * @returns {string} The name of the employee.
     */
    private getEmployeeName(employeeId: string): string {
        const employee = this.employees.find(emp => emp.id === employeeId);
        return employee
            ? `${employee.first_name} ${employee.last_name}`
            : 'Unknown';
    }

    /**
     * Validates the schedule to ensure compliance with the 11-hour rest rule.
     * @returns {ScheduleOutput} The result of the schedule validation.
     */
    public validate(): ScheduleOutput {
        const violations: Violation[] = [];
        const employeeShifts: {[key: string]: Shift[]} = {};

        // Group shifts by employee
        this.shifts.forEach(shift => {
            if (!employeeShifts[shift.employee_id]) {
                employeeShifts[shift.employee_id] = [];
            }
            employeeShifts[shift.employee_id].push(shift);
        });

        // Validate each employee's shifts
        for (const employeeId in employeeShifts) {
            const shifts = employeeShifts[employeeId];
            shifts.sort(
                (a, b) =>
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
            );

            for (let i = 1; i < shifts.length; i++) {
                const previousShiftEnd = new Date(
                    shifts[i - 1].end_time
                ).getTime();
                const currentShiftStart = new Date(
                    shifts[i].start_time
                ).getTime();
                const restPeriod =
                    (currentShiftStart - previousShiftEnd) / (1000 * 60 * 60);

                if (restPeriod < 11) {
                    violations.push({
                        employee_name: this.getEmployeeName(employeeId),
                        date: shifts[i].start_time.split('T')[0],
                        details: `The break between shifts was only ${restPeriod.toFixed(2)} hours.`,
                    });
                }
            }
        }

        return {
            is_schedule_valid: violations.length === 0,
            violations: violations,
        };
    }
}
