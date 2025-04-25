import sequelizeConnection from './../database_auth';

jest.mock('sequelize', () => {
    const SequelizeMock = jest.fn().mockImplementation(() => ({
        config: {
            database: 'process.env.DATABASE_CONNECTION_URI',
        },
    }));
    return {Sequelize: SequelizeMock};
});

describe('database-access > src > models > database_auth', () => {
    it('should have the correct database URI', () => {
        const dbUri = 'process.env.DATABASE_CONNECTION_URI';
        expect(sequelizeConnection.config.database).toBe(dbUri);
    });
});
