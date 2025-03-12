import query from "../config/query";

export interface Product {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stockCount: number;
  brand: string;
  imageUrl: string;
  isAvailable: boolean;
  createdAt?: string;
}

export async function getAllProducts(): Promise<Product[] | null> {
  const queryText = `SELECT * FROM products;`;
  const products = await query(queryText);
  return products.rows;
}

export async function getProductById(id: string): Promise<Product[] | null> {
  const queryText = `SELECT * FROM products WHERE id = $1;`;
  const product = await query(queryText, id);
  return product.rows.length === 0 ? null : product.rows[0];
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt">,
): Promise<Product> {
  const queryText = `INSERT INTO
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
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8
      )
  RETURNING *;`;

  const values = [
    product.name,
    product.category,
    product.description,
    product.price,
    product.stockCount,
    product.brand,
    product.imageUrl,
    product.isAvailable,
  ];

  const result = await query(queryText, ...values);

  return result.rows[0];
}

export async function updateProductPartly(
  id: string,
  fields: Partial<Omit<Product, "id" | "createdAt">>,
): Promise<Product | null> {
  if (Object.keys(fields).length === 0) {
    throw new Error("No fields provided for update");
  }

  const keys = Object.keys(fields);
  const setClause = keys
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(", ");
  const values = keys.map((key) => fields[key as keyof typeof fields]);

  const queryText = `UPDATE products SET ${setClause} WHERE id = $${
    values.length + 1
  } RETURNING *;`;

  const result = await query(queryText, ...values.concat(id));
  return result.rows.length === 0 ? null : result.rows[0];
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const queryText = `DELETE FROM products WHERE id = $1 RETURNING *;`;
  const result = await query(queryText, id);
  return result.rows.length === 0 ? null : result.rows[0];
}

export async function searchProducts(criteria: {
  sortByPrice?: "asc" | "desc";
  isavailable?: boolean;
}): Promise<Product[]> {
  let queryText = `SELECT * FROM products`;
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (criteria.isavailable !== undefined) {
    conditions.push(`"isavailable" = $${paramIndex}`);
    values.push(criteria.isavailable);
    paramIndex++;
  }

  if (conditions.length > 0) {
    queryText += " WHERE " + conditions.join(" AND ");
  }

  if (criteria.sortByPrice) {
    queryText += ` ORDER BY price ${criteria.sortByPrice.toUpperCase()}`;
  }

  queryText += ";";

  const result = await query(queryText, ...values);
  return result.rows;
}
