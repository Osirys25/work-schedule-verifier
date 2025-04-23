import express from 'express';
import bodyParser from 'body-parser';

import {verificationService} from './db_services';
import verification from './api/verification';

const server = express();
const port = 3000;

server.use(bodyParser.json());

server.use('/verification/', verification);

server.listen(port, async () => {
    await verificationService.init();
    return console.log(`Express is listening at http://localhost:${port}`);
});
