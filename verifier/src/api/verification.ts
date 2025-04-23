import * as Express from 'express';
import {EmployeeShifts} from '../controllers';

const router = Express.Router();

router.post('/check/', async (req, res, next) => {
    const {employees, employeeShifts} = req.body;

    const employeeShiftVerifier = new EmployeeShifts(employeeShifts, employees);

    const errors = employeeShiftVerifier.validate();

    res.status(200);
    res.send(errors);
    return null;
});

export default router;
