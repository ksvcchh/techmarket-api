export const productsProperties = {
    _id: { bsonType: "objectId" },
    name: {
        bsonType: "string",
        description: "'name' must be string and is required",
    },
    category: {
        bsonType: "string",
        description: "'category' must be string and is required",
    },
    description: {
        bsonType: "string",
        description: "'description' must be string and is required",
    },
    price: {
        bsonType: "double",
        minimum: 0.01,
        description: "'price' must be double, geq 0.01, and is required",
    },
    stockCount: {
        bsonType: "int",
        minimum: 0,
        description: "'stockCount' must be int, geq than 0, and is required",
    },
    brand: {
        bsonType: "string",
        description: "'brand' must be string and is required",
    },
    imageUrl: {
        bsonType: "string",
        description: "'imageUrl' must be string and is required",
    },
    isAvailable: {
        bsonType: "bool",
        description: "'isAvailable' must be true/false and is required",
    },
};
