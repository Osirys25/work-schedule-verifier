import express from 'express';
import sequelize from './models/database_auth';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello Boilerplate!');
});

app.listen(port, () => {
    sequelize.authenticate().then(r => console.log(r));
    return console.log(`Express is listening at http://localhost:${port}`);
});
