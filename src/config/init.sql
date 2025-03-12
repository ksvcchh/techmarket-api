CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    price REAL NOT NULL,
    stockCount INTEGER NOT NULL,
    brand VARCHAR(100) NOT NULL,
    imageUrl VARCHAR(100) NOT NULL,
    isAvailable BOOLEAN NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
    products (
        name,
        category,
        description,
        price,
        stockCount,
        brand,
        imageUrl,
        isAvailable
    )
VALUES
    (
        'MacBook Pro 16',
        'Laptopy',
        'Laptop Apple z procesorem M1 Pro, 16GB RAM, 512GB SSD',
        9999.99,
        15,
        'Apple',
        'https://example.com/macbook.jpg',
        true
    ),
    (
        'Dell XPS 15',
        'Laptopy',
        'Laptop Dell z procesorem Intel Core i7, 16GB RAM, 512GB SSD, 15.6" FHD',
        8499.99,
        10,
        'Dell',
        'https://example.com/dell_xps15.jpg',
        true
    ),
    (
        'Lenovo ThinkPad X1 Carbon',
        'Laptopy',
        'Laptop Lenovo z procesorem Intel Core i7, 16GB RAM, 1TB SSD, lekka konstrukcja',
        8999.99,
        12,
        'Lenovo',
        'https://example.com/thinkpad_x1.jpg',
        true
    ),
    (
        'HP Spectre x360',
        'Laptopy',
        'Laptop HP z procesorem Intel Core i7, 16GB RAM, 512GB SSD, funkcja 2-w-1',
        7999.99,
        8,
        'HP',
        'https://example.com/hp_spectrex360.jpg',
        true
    ),
    (
        'Asus ZenBook 14',
        'Laptopy',
        'Laptop Asus z procesorem AMD Ryzen 7, 16GB RAM, 512GB SSD, kompaktowy design',
        7499.99,
        20,
        'Asus',
        'https://example.com/asus_zenbook14.jpg',
        true
    ) ON CONFLICT DO NOTHING;
