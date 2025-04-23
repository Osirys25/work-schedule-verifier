import * as Express from 'express';
import {verificationService} from '../db_services';

const router = Express.Router();

router.post('/', async (req: Express.Request, res: Express.Response) => {
    console.log(req.body);

    if (!req.body) {
        res.status(400).send({error: 'Bad Request: Missing request body'});
        return null;
    }

    const {is_valid, schedule_sha} = req.body;

    if (
        typeof is_valid === 'undefined' ||
        typeof schedule_sha === 'undefined'
    ) {
        res.status(400).send({
            error: 'Bad Request: Missing or empty required parameters',
        });
        return null;
    }

    console.log(is_valid, schedule_sha);

    await verificationService.addNewVerification({is_valid, schedule_sha});

    res.status(200).send();
    return null;
});

export default router;
