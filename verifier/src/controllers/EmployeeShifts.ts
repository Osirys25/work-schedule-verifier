type Shift = {
    employee_id: string;
    start_time: string;
    end_time: string;
};

type Employee = {
    id: string;
    first_name: string;
    last_name: string;
    flexible_hours: boolean;
};

type Violation = {
    employee_name: string;
    date: string;
    details: string;
};

type ScheduleOutput = {
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

    private getEmployeeName(employeeId: string): string {
        const employee = this.employees.find(emp => emp.id === employeeId);
        return employee
            ? `${employee.first_name} ${employee.last_name}`
            : 'Unknown';
    }

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
                        details: `Przerwa między zmianami wynosiła tylko ${restPeriod.toFixed(2)} godzin.`,
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
