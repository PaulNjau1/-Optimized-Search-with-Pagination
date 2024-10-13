"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)()); // Enable CORS
app.use(express_1.default.json());
app.get('/products', async (req, res) => {
    const { search = '', category = '', priceMin, priceMax, page = '1', pageSize = '10' } = req.query;
    const filters = {
        AND: [],
    };
    // Adding filters only if they exist
    if (search) {
        filters.AND.push({
            name: {
                contains: search,
                mode: 'insensitive',
            },
        });
    }
    if (category) {
        filters.AND.push({ category });
    }
    if (priceMin) {
        filters.AND.push({ price: { gte: Number(priceMin) } });
    }
    if (priceMax) {
        filters.AND.push({ price: { lte: Number(priceMax) } });
    }
    const pageNum = Math.max(Number(page), 1);
    const pageSizeNum = Math.max(Number(pageSize), 1);
    const skip = (pageNum - 1) * pageSizeNum;
    try {
        const [products, totalProducts] = await Promise.all([
            prisma.product.findMany({
                where: filters,
                skip,
                take: pageSizeNum,
            }),
            prisma.product.count({ where: filters }),
        ]);
        res.json({
            data: products,
            pagination: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / pageSizeNum),
                currentPage: pageNum,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
