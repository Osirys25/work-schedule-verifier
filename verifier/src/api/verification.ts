import * as Express from 'express';
import {EmployeeShifts, ScheduleOutput} from '../controllers';
import {HttpClient} from '../services';
import {CryptoVerificationDetails} from '../services/crypto';

const router = Express.Router();

/**
 * @swagger
 * /check/:
 *   post:
 *     summary: Validate employee shifts
 *     description: Validates the provided employee shifts and returns any errors.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     flexible_hours:
 *                       type: boolean
 *               employeeShifts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     employee_id:
 *                       type: string
 *                     start_time:
 *                       type: string
 *                     end_time:
 *                       type: string
 *     responses:
 *       200:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_schedule_valid:
 *                   type: boolean
 *                 violations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employee_name:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       details:
 *                         type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/check/', async (req: Express.Request, res: Express.Response) => {
    if (!req.body) {
        res.status(400).send({error: 'Bad Request: Missing request body'});
        return null;
    }

    const {employees = [], employeeShifts = []} = req.body;

    if (employees.length === 0 || employeeShifts.length === 0) {
        res.status(400).send({
            error: 'Bad Request: Missing or empty employees or employeeShifts',
        });
        return null;
    }

    const employeeShiftVerifier = new EmployeeShifts(employeeShifts, employees);

    const errors: ScheduleOutput = employeeShiftVerifier.validate();

    const httpClient = new HttpClient(process.env.DATABASE_ACCESS_PATH);

    const scheduleSha: string = CryptoVerificationDetails.processSchedule(
        JSON.stringify(req.body)
    );

    try {
        await httpClient.sendVerificationDetails({
            is_valid: errors.is_schedule_valid,
            schedule_sha: scheduleSha,
        });
    } catch (error) {
        console.log(error);
    }

    res.status(200).send(errors);
    return null;
});

export default router;
