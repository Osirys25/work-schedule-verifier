import express from 'express';
import history from './api/history';
const server = express();
const port = 3000;

server.use('/history/', history);

server.listen(port, () => {
    return console.log(
        `Database-access - express is listening at http://localhost:${port}`
    );
});
