import React, { useEffect, useState, useCallback } from 'react';
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
  const [pageSize] = useState(10); // Assuming a fixed page size
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]); // State to hold category options

  // Function to fetch filtered product data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/products', {
        params: {
          search,
          category,
          priceMin,
          priceMax,
          page,
          pageSize,
        },
      });

      console.log('Search Response data:', response.data); // Debugging line
      setProducts(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category, priceMin, priceMax, page, pageSize]);

  // Fetch categories for the dropdown (this could be an API call to fetch categories)
  const fetchCategories = async () => {
    // Assuming categories are hardcoded for demonstration purposes
    setCategories(['Electronics', 'Clothing', 'Books', 'Home', 'Beauty']);
  };

  useEffect(() => {
    fetchCategories(); // Fetch category options on component mount
  }, []);

  // Trigger fetchData when the page or search filters change
  useEffect(() => {
    fetchData();
  }, [page, search, category, priceMin, priceMax, fetchData]);

  // Trigger search on input change (search input)
  useEffect(() => {
    setPage(1); // Reset to the first page on new search
    fetchData();
  }, [search]);

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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Table to display products */}
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="border-b p-2 text-left">Name</th>
                <th className="border-b p-2 text-left">Description</th>
                <th className="border-b p-2 text-left">Price</th>
                <th className="border-b p-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border-b p-2">{product.name}</td>
                    <td className="border-b p-2">{product.description}</td>
                    <td className="border-b p-2">${product.price.toFixed(2)}</td>
                    <td className="border-b p-2">{product.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center border-b p-2">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
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
        </>
      )}
    </div>
  );
};

export default App;
