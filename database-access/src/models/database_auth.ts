import {Sequelize} from 'sequelize';

const dbUri = process.env.DATABASE_CONNECTION_URI;

const sequelizeConnection = new Sequelize(dbUri, {
    logging: false,
});

export default sequelizeConnection;
