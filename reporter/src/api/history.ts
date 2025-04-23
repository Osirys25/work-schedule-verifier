import * as Express from 'express';
import {HttpClient} from '../services';

const router = Express.Router();

router.get('/', async (req: Express.Request, res: Express.Response) => {
    const {limit, offset} = req.query as unknown as {
        limit: string;
        offset: string;
    };

    const httpClient = new HttpClient(process.env.DATABASE_ACCESS_PATH);

    const history = await httpClient.getVerificationDetails(limit, offset);

    res.status(200).send(history);
    return null;
});

export default router;
