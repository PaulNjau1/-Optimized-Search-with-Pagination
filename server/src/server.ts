import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Search and Paginate
app.get('/products', async (req, res) => {
  const { page = 1, pageSize = 10, search = '', category = '', priceMin, priceMax } = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);

  const filters: any = {
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
