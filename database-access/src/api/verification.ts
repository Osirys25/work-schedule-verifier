import * as Express from 'express';
import {verificationService} from '../db_services';

const router = Express.Router();

/**
 * @swagger
 * /verification/:
 *   post:
 *     summary: Adds a new verification entry to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_valid:
 *                 type: boolean
 *                 description: Indicates if the verification is valid.
 *               schedule_sha:
 *                 type: string
 *                 description: SHA of the schedule.
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     employee_name:
 *                       type: string
 *                       description: Name of the employee.
 *                     date:
 *                       type: string
 *                       description: Date of the error.
 *                     break_period:
 *                       type: string
 *                       description: Period of the break.
 *     responses:
 *       200:
 *         description: Verification added successfully.
 *       400:
 *         description: Bad Request - Missing or empty required parameters.
 */
router.post('/', async (req: Express.Request, res: Express.Response) => {
    if (!req.body) {
        res.status(400).send({error: 'Bad Request: Missing request body'});
        return null;
    }

    const {is_valid, schedule_sha, errors} = req.body;

    if (
        typeof is_valid === 'undefined' ||
        typeof schedule_sha === 'undefined' ||
        typeof errors === 'undefined'
    ) {
        res.status(400).send({
            error: 'Bad Request: Missing or empty required parameters',
        });
        return null;
    }

    await verificationService.addNewVerification(
        {is_valid, schedule_sha},
        errors
    );

    res.status(200).send();
    return null;
});

/**
 * @swagger
 * /verifications/:
 *   get:
 *     summary: Retrieves all verification entries from the database with pagination.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         required: true
 *         description: The maximum number of entries to retrieve.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: string
 *         required: true
 *         description: The number of entries to skip.
 *     responses:
 *       200:
 *         description: A list of verification entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uuid:
 *                     type: string
 *                     description: The unique identifier for the verification.
 *                   is_valid:
 *                     type: boolean
 *                     description: Indicates if the verification is valid.
 *                   schedule_sha:
 *                     type: string
 *                     description: SHA of the schedule.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The creation date of the verification.
 *                   violations:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         employee_name:
 *                           type: string
 *                           description: Name of the employee.
 *                         date:
 *                           type: string
 *                           description: Date of the error.
 *                         break_period:
 *                           type: string
 *                           description: Period of the break.
 *       400:
 *         description: Bad Request - Missing or empty required parameters.
 */
router.get('/', async (req: Express.Request, res: Express.Response) => {
    const {limit, offset} = req.query;

    if (typeof limit === 'undefined' || typeof offset === 'undefined') {
        res.status(400).send({
            error: 'Bad Request: Missing or empty required parameters',
        });
        return null;
    }

    const verifications = await verificationService.getAllVerifications(
        limit as unknown as number,
        offset as unknown as number
    );

    console.log(verifications);

    res.status(200).send(verifications);
    return null;
});

export default router;
