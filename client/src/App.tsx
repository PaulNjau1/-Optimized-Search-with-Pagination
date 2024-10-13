import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
};

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3000/products', {
        params: {
          search,
          category,
          priceMin,
          priceMax,
          page,
          pageSize,
        },
      });

      setProducts(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    };

    fetchData();
  }, [search, category, priceMin, priceMax, page]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="border p-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4">
            <h2 className="font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <p>{product.category}</p>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="border p-2"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="border p-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
