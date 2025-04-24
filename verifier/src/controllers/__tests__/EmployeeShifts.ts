import {EmployeeShifts} from '../EmployeeShifts';

jest.mock('../../utils', () => ({
    EmployeeUtils: {
        getEmployeeName: jest.fn((id, employees) => {
            const employee = employees.find(emp => emp.id === id);
            return employee
                ? `${employee.first_name} ${employee.last_name}`
                : 'Unknown';
        }),
    },
    ShiftUtils: {
        groupShiftsByEmployee: jest.fn(shifts => {
            const employeeShifts = {};
            shifts.forEach(shift => {
                if (!employeeShifts[shift.employee_id]) {
                    employeeShifts[shift.employee_id] = [];
                }
                employeeShifts[shift.employee_id].push(shift);
            });
            return employeeShifts;
        }),
        sortShiftsByStartTime: jest.fn(shifts => {
            return shifts.sort(
                (a, b) =>
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
            );
        }),
        calculateRestPeriod: jest.fn((previousShift, currentShift) => {
            const previousShiftEnd = new Date(previousShift.end_time).getTime();
            const currentShiftStart = new Date(
                currentShift.start_time
            ).getTime();
            return (currentShiftStart - previousShiftEnd) / (1000 * 60 * 60);
        }),
        calculateEndOfWorkDayRestPeriod: jest.fn((currentShift, nextShift) => {
            const currentShiftStart = new Date(
                currentShift.start_time
            ).getTime();
            const nextShiftStart = nextShift
                ? new Date(nextShift.start_time).getTime()
                : null;
            const workDayEnd =
                nextShiftStart &&
                nextShiftStart < currentShiftStart + 24 * 60 * 60 * 1000
                    ? nextShiftStart
                    : currentShiftStart + 24 * 60 * 60 * 1000;
            return (workDayEnd - currentShiftStart) / (1000 * 60 * 60);
        }),
    },
}));

describe('EmployeeShifts', () => {
    const shifts = [
        {
            employee_id: '1',
            start_time: '2023-04-01T08:00:00Z',
            end_time: '2023-04-01T16:00:00Z',
        },
        {
            employee_id: '1',
            start_time: '2023-04-02T01:00:00Z',
            end_time: '2023-04-02T16:00:00Z',
        },
    ];

    const employees = [
        {id: '1', first_name: 'John', last_name: 'Doe', flexible_hours: false},
    ];

    test('should validate schedule and return violations', () => {
        const employeeShifts = new EmployeeShifts(shifts, employees);
        const result = employeeShifts.validate();

        expect(result.is_schedule_valid).toBe(false);
        expect(result.violations).toHaveLength(1);
        expect(result.violations[0].employee_name).toBe('John Doe');
    });

    test('should return valid schedule when no violations', () => {
        const noViolationShifts = [
            {
                employee_id: '1',
                start_time: '2023-04-01T08:00:00Z',
                end_time: '2023-04-01T16:00:00Z',
            },
            {
                employee_id: '1',
                start_time: '2023-04-03T08:00:00Z',
                end_time: '2023-04-03T16:00:00Z',
            },
        ];

        const employeeShifts = new EmployeeShifts(noViolationShifts, employees);
        const result = employeeShifts.validate();

        expect(result.is_schedule_valid).toBe(true);
        expect(result.violations).toHaveLength(0);
    });
});
