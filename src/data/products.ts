import { v4 as uuidv4 } from "uuid";

export const products = {
  resources: [
    {
      id: uuidv4(),
      name: 'MacBook Pro 16"',
      category: "Laptopy",
      description: "Laptop Apple z procesorem M1 Pro, 16GB RAM, 512GB SSD",
      price: 9999.99,
      stockCount: 15,
      brand: "Apple",
      imageUrl: "https://example.com/macbook.jpg",
      isAvailable: true,
      createdAt: "2023-01-15T14:30:00Z",
    },
    {
      id: uuidv4(),
      name: "iPhone 14 Pro",
      category: "Smartfony",
      description: "Smartfon Apple z procesorem A16 Bionic, 128GB pamięci",
      price: 5999.99,
      stockCount: 30,
      brand: "Apple",
      imageUrl: "https://example.com/iphone.jpg",
      isAvailable: true,
      createdAt: "2023-02-20T09:00:00Z",
    },
    {
      id: uuidv4(),
      name: "Samsung Galaxy S23",
      category: "Smartfony",
      description:
        "Smartfon Samsung z najnowszym procesorem Snapdragon, 256GB pamięci",
      price: 4999.99,
      stockCount: 20,
      brand: "Samsung",
      imageUrl: "https://example.com/galaxy-s23.jpg",
      isAvailable: true,
      createdAt: "2023-03-10T11:45:00Z",
    },
    {
      id: uuidv4(),
      name: "Dell XPS 15",
      category: "Laptopy",
      description:
        "Laptop Dell z procesorem Intel Core i7, 16GB RAM, 512GB SSD",
      price: 8999.99,
      stockCount: 10,
      brand: "Dell",
      imageUrl: "https://example.com/dell-xps15.jpg",
      isAvailable: true,
      createdAt: "2023-04-05T08:30:00Z",
    },
  ],
};
