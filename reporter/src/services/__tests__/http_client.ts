import {HttpClient} from '../http_client';

describe('reporter > src > services > HttpClient', () => {
    const mockPath = 'http://mocked-path.com';
    let httpClient: HttpClient;

    beforeEach(() => {
        httpClient = new HttpClient(mockPath);
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getVerificationDetails', () => {
        it('should fetch verification details with correct parameters', async () => {
            const mockResponse = {
                json: jest.fn().mockResolvedValue([
                    {
                        uuid: '70d26182-d053-4318-869d-0e18748e3963',
                        is_valid: false,
                        schedule_sha:
                            'wTNYVs+QYZw5bK/V43zKSOVVjhUs0ReyXBY/IAMyTgY=',
                        createdAt: '2025-04-24T06:12:47.170Z',
                        updatedAt: '2025-04-24T06:12:47.170Z',
                        violations: [
                            {
                                employee_name: 'Tomasz Lewandowski',
                                date: '2025-04-24',
                                details:
                                    'The break between shifts was only 9.00 hours.',
                            },
                        ],
                    },
                ]),
            };

            (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

            const limit = '10';
            const offset = '0';
            const result = await httpClient.getVerificationDetails(
                limit,
                offset
            );

            expect(global.fetch).toHaveBeenCalledWith(
                `${mockPath}/verification/?limit=10&offset=0`,
                {method: 'GET'}
            );
            expect(result).toEqual([
                {
                    uuid: '70d26182-d053-4318-869d-0e18748e3963',
                    is_valid: false,
                    schedule_sha:
                        'wTNYVs+QYZw5bK/V43zKSOVVjhUs0ReyXBY/IAMyTgY=',
                    createdAt: '2025-04-24T06:12:47.170Z',
                    updatedAt: '2025-04-24T06:12:47.170Z',
                    violations: [
                        {
                            employee_name: 'Tomasz Lewandowski',
                            date: '2025-04-24',
                            details:
                                'The break between shifts was only 9.00 hours.',
                        },
                    ],
                },
            ]);
        });
    });
});
