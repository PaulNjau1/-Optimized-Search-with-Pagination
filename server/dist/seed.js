"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// seed.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const products = Array.from({ length: 200 }, (_, index) => {
        const id = index + 1;
        return {
            name: `Product ${id}`,
            description: `Description for product ${id}. This is a sample description for the product, showcasing its features and benefits.`,
            price: Number((Math.random() * 1000).toFixed(2)), // Random price between 0 and 1000
            category: getRandomCategory(),
        };
    });
    await prisma.product.createMany({
        data: products,
    });
}
function getRandomCategory() {
    const categories = ['Electronics', 'Books', 'Clothing', 'Home Appliances', 'Toys', 'Sports', 'Beauty'];
    return categories[Math.floor(Math.random() * categories.length)];
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
