import * as Express from 'express';
import {verificationService} from '../db_services';

const router = Express.Router();

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
