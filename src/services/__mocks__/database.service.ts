export async function connectToDatabase() {
    return Promise.resolve();
}

export const collections = {
    products: {
        find: jest.fn(),
        findOne: jest.fn(),
        insertOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
        aggregate: jest.fn(),
    },
    users: {
        find: jest.fn(),
        findOne: jest.fn(),
        insertOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
        aggregate: jest.fn(),
    },
    reviews: {
        find: jest.fn(),
        findOne: jest.fn(),
        insertOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
        aggregate: jest.fn(),
    },
};
