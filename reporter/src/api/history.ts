import * as Express from 'express';
import {HttpClient} from '../services';

const router = Express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve verification details
 *     description: Fetches verification details with pagination.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         required: true
 *         description: The number of records to return.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: string
 *         required: true
 *         description: The number of records to skip.
 *     responses:
 *       200:
 *         description: A list of verification details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uuid:
 *                     type: string
 *                     example: "70d26182-d053-4318-869d-0e18748e3963"
 *                   is_valid:
 *                     type: boolean
 *                     example: false
 *                   schedule_sha:
 *                     type: string
 *                     example: "wTNYVs+QYZw5bK/V43zKSOVVjhUs0ReyXBY/IAMyTgY="
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-24T06:12:47.170Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-24T06:12:47.170Z"
 *                   violations:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         employee_name:
 *                           type: string
 *                           example: "Tomasz Lewandowski"
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: "2025-04-24"
 *                         break_period:
 *                           type: string
 *                           example: "9.00"
 *       400:
 *         description: Bad Request: Missing or empty required parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad Request: Missing or empty required parameters"
 */
router.get('/', async (req: Express.Request, res: Express.Response) => {
    const {limit, offset} = req.query as unknown as {
        limit: string;
        offset: string;
    };

    if (
        typeof limit === 'undefined' ||
        typeof offset === 'undefined' ||
        isNaN(Number(limit)) ||
        isNaN(Number(offset))
    ) {
        res.status(400).send({
            error: 'Bad Request: Missing or empty required parameters',
        });
        return null;
    }

    const httpClient = new HttpClient(process.env.DATABASE_ACCESS_PATH);

    const history = await httpClient.getVerificationDetails(limit, offset);

    res.status(200).send(history);
    return null;
});

export default router;
