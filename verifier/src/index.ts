import express from 'express';
import bodyParser from 'body-parser';

import verification from "./api/verification";
const server = express();
const port = 3000;

// server.get('/', (req, res) => {
//     res.send('Hello Boilerplate reporter!');
// });

server.use(bodyParser.json());

server.use('/', verification);

server.listen(port, () => {
    return console.log(`Verifier service is listening at http://localhost:${port}`);
});
