export const usersProperties = {
    _id: { bsonType: "objectId" },
    username: {
        bsonType: "string",
        description: "'username' must be string and is required",
    },
    email: {
        bsonType: "string",
        description: "'email' must be string and is required",
    },
    passwordHash: {
        bsonType: "string",
        description: "'passwordHash' must be string and is required",
    },
    firstName: {
        bsonType: "string",
        description: "'firstName' must be string and is required",
    },
    lastName: {
        bsonType: "string",
        description: "'lastName' must be string and is required",
    },
};
