import "dotenv/config";
import * as mongoDB from "mongodb";
import { productsProperties } from "./schemas/products";
import { usersProperties } from "./schemas/users";
import { reviewsProperties } from "./schemas/reviews";

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "techmarket_api";
const PRODUCTS_COLLECTION_NAME =
    process.env.PRODUCTS_COLLECTION_NAME || "products";
const USERS_COLLECTION_NAME = process.env.USERS_COLLECTION_NAME || "users";
const REVIEWS_COLLECTION_NAME =
    process.env.REVIEWS_COLLECTION_NAME || "reviews";

export const collections: {
    products: mongoDB.Collection;
    users: mongoDB.Collection;
    reviews: mongoDB.Collection;
} = {
    products: {} as mongoDB.Collection,
    users: {} as mongoDB.Collection,
    reviews: {} as mongoDB.Collection,
};

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(URI);
    await client.connect();
    const db: mongoDB.Db = client.db(DB_NAME);

    await db
        .createCollection(PRODUCTS_COLLECTION_NAME, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    additionalProperties: false,
                    required: [
                        "_id",
                        "name",
                        "category",
                        "description",
                        "price",
                        "stockCount",
                        "brand",
                        "imageUrl",
                        "isAvailable",
                    ],
                    properties: productsProperties,
                },
            },
        })
        .catch((err) => {
            if (err.codeName !== "NamespaceExists") throw err;
        });

    await db
        .createCollection(USERS_COLLECTION_NAME, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    additionalProperties: false,
                    required: [
                        "_id",
                        "username",
                        "email",
                        "passwordHash",
                        "firstName",
                        "lastName",
                    ],
                    properties: usersProperties,
                },
            },
        })
        .catch((err) => {
            if (err.codeName !== "NamespaceExists") throw err;
        });

    await db
        .createCollection(REVIEWS_COLLECTION_NAME, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    additionalProperties: false,
                    required: [
                        "productId",
                        "userId",
                        "rating",
                        "title",
                        "content",
                        "pros",
                        "cons",
                        "verifiedPurchase",
                        "likes",
                    ],
                    properties: reviewsProperties,
                },
            },
        })
        .catch((err) => {
            if (err.codeName !== "NamespaceExists") throw err;
        });

    const productsCollection: mongoDB.Collection = db.collection(
        PRODUCTS_COLLECTION_NAME,
    );
    const usersCollection: mongoDB.Collection = db.collection(
        USERS_COLLECTION_NAME,
    );
    const reviewsCollection: mongoDB.Collection = db.collection(
        REVIEWS_COLLECTION_NAME,
    );

    collections.products = productsCollection;
    collections.users = usersCollection;
    collections.reviews = reviewsCollection;

    console.log(
        `Successfully connected to database: ${db.databaseName} and collections:` +
            `${productsCollection.collectionName}, ${usersCollection.collectionName}, ` +
            `${reviewsCollection.collectionName}.`,
    );
}
