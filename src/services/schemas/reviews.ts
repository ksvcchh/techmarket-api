export const reviewsProperties = {
    _id: { bsonType: "objectId" },
    productId: {
        bsonType: "objectId",
        description: "'productId' should be of objectId type and is required",
    },
    userId: {
        bsonType: "objectId",
        description: "'userId' should be of objectId type and is required",
    },
    rating: {
        bsonType: "int",
        minimum: 1,
        maximum: 5,
        description: "'rating' should be of int type, 1 to 5, and is required",
    },
    title: {
        bsonType: "string",
        description: "'title' should be of string type and is required",
    },
    content: {
        bsonType: "string",
        description: "'content' should be of string type and is required",
    },
    pros: {
        bsonType: "array",
        description: "'pros' should be of array type and is required",
    },
    cons: {
        bsonType: "array",
        description: "'cons' should be of array type and is required",
    },
    verifiedPurchase: {
        bsonType: "bool",
        description:
            "'verifiedPurchase' should be of bool type and is required",
    },
    likes: {
        bsonType: "int",
        minimum: 0,
        description: "'likes' should be of int type, geq 0, and is required",
    },
};
