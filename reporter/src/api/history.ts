import * as Express from 'express';

const router = Express.Router();

router.get('/', async (req: Express.Request, res: Express.Response) => {
    const {limit, offset} = req.query;

    console.log(limit, offset);

    res.status(200).send();
    return null;
});

export default router;
