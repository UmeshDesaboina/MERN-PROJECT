import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../Services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: 'name',
    minPrice: '',
    maxPrice: ''
  });
  const location = useLocation();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
  const query = new URLSearchParams(location.search);
    const newFilters = {
      category: query.get('category') || '',
      search: query.get('search') || '',
      sort: query.get('sort') || 'name',
      minPrice: query.get('minPrice') || '',
      maxPrice: query.get('maxPrice') || ''
    };
    setFilters(newFilters);
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

    const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        page: page.toString()
      }).toString();
      
      const res = await api.get(`/products?${queryParams}`);
      
      if (isMounted.current) {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      }
      } catch (err) {
      if (isMounted.current) {
        setError(err?.response?.data?.msg || 'Failed to fetch products');
      }
    } finally {
      if (isMounted.current) {
      setLoading(false);
      }
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setFilters({ ...filters, sort: e.target.value });
  };

  const handlePriceFilter = () => {
    setFilters({ ...filters, minPrice: priceRange.min, maxPrice: priceRange.max });
  };

  const clearFilters = () => {
    setFilters({ category: '', search: '', sort: 'name', minPrice: '', maxPrice: '' });
    setPriceRange({ min: '', max: '' });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
          {filters.category ? `${filters.category} Products` : 'All Products'}
        </h1>
        <p style={{ color: '#64748b' }}>
          {products.length} products found
        </p>
      </div>

      {error && <ErrorMessage msg={error} />}

      {/* Filters */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select value={sortBy} onChange={handleSortChange} className="form-input">
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="price">Price Low to High</option>
              <option value="-price">Price High to Low</option>
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Min Price</label>
            <input
              type="number"
              value={priceRange.min}
              onChange={e => setPriceRange({...priceRange, min: e.target.value})}
              className="form-input"
              placeholder="0"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Max Price</label>
            <input
              type="number"
              value={priceRange.max}
              onChange={e => setPriceRange({...priceRange, max: e.target.value})}
              className="form-input"
              placeholder="1000"
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handlePriceFilter} className="btn-primary">
            Apply Filters
          </button>
          <button onClick={clearFilters} className="btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '12px',
              marginTop: '32px'
            }}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                Previous
              </button>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      style={{
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        background: page === pageNum ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f5f9',
                        color: page === pageNum ? 'white' : '#64748b',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
                className="btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            No products found
          </h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Try adjusting your filters or search terms
          </p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;