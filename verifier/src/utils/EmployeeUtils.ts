import {Employee} from '../controllers';

export class EmployeeUtils {
    /**
     * Gets the name of an employee by their ID.
     * @param {string} employeeId - The ID of the employee.
     * @param {Employee[]} employees - The list of employees.
     * @returns {string} The name of the employee.
     */
    static getEmployeeName(employeeId: string, employees: Employee[]): string {
        const employee = employees.find(emp => emp.id === employeeId);
        return employee
            ? `${employee.first_name} ${employee.last_name}`
            : 'Unknown';
    }
}
