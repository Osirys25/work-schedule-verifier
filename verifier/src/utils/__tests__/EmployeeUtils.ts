import {EmployeeUtils} from '../EmployeeUtils';
import {Employee} from '../../controllers';

describe('verifier > src > utils > EmployeeUtils', () => {
    const employees: Employee[] = [
        {id: '1', first_name: 'John', last_name: 'Doe', flexible_hours: true},
        {
            id: '2',
            first_name: 'Jane',
            last_name: 'Smith',
            flexible_hours: false,
        },
    ];

    it('should return the name of the employee when a valid ID is provided', () => {
        const employeeName = EmployeeUtils.getEmployeeName('1', employees);
        expect(employeeName).toBe('John Doe');
    });

    it('should return "Unknown" when an invalid ID is provided', () => {
        const employeeName = EmployeeUtils.getEmployeeName('3', employees);
        expect(employeeName).toBe('Unknown');
    });

    it('should return "Unknown" when the employees array is empty', () => {
        const employeeName = EmployeeUtils.getEmployeeName('1', []);
        expect(employeeName).toBe('Unknown');
    });
});
