"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
// Search and Paginate
app.get('/products', async (req, res) => {
    const { page = 1, pageSize = 10, search = '', category = '', priceMin, priceMax } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const filters = {
        AND: [],
    };
    if (search) {
        filters.AND.push({
            OR: [
                { name: { contains: String(search), mode: 'insensitive' } },
                { description: { contains: String(search), mode: 'insensitive' } }
            ],
        });
    }
    if (category) {
        filters.AND.push({ category: String(category) });
    }
    if (priceMin) {
        filters.AND.push({ price: { gte: Number(priceMin) } });
    }
    if (priceMax) {
        filters.AND.push({ price: { lte: Number(priceMax) } });
    }
    const products = await prisma.product.findMany({
        where: filters,
        skip,
        take: Number(pageSize),
        orderBy: {
            createdAt: 'desc',
        },
    });
    const totalProducts = await prisma.product.count({ where: filters });
    res.json({
        data: products,
        pagination: {
            total: totalProducts,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages: Math.ceil(totalProducts / Number(pageSize)),
        },
    });
});
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
