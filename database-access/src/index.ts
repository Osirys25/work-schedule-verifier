import express from 'express';
import bodyParser from 'body-parser';

import {verificationService} from './db_services';
import verification from './api/verification';
import {verificationErrorService} from './db_services/verification_errors_service';

const server = express();
const port = 3000;

server.use(bodyParser.json());

server.use('/verification/', verification);

server.listen(port, async () => {
    await verificationService.init();
    await verificationErrorService.init();
    return console.log(`Express is listening at http://localhost:${port}`);
});
