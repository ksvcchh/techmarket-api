-- AlterTable
ALTER TABLE "categories"
ALTER COLUMN "description"
SET
    DATA TYPE VARCHAR(500);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_in_shopping_cart" (
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "shopping_cart_id" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "products_in_shopping_cart_pkey" PRIMARY KEY ("product_id", "shopping_cart_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shopping_cart_user_id_key" ON "shopping_cart" ("user_id");

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_in_shopping_cart" ADD CONSTRAINT "products_in_shopping_cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_in_shopping_cart" ADD CONSTRAINT "products_in_shopping_cart_shopping_cart_id_fkey" FOREIGN KEY ("shopping_cart_id") REFERENCES "shopping_cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "products_in_shopping_cart" ADD CONSTRAINT "check_product_quantity" CHECK (quantity > 0);
