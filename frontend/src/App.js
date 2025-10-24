import React, { useState, useEffect, useCallback } from 'react';
     import './App.css';

     function App() {
       const [products, setProducts] = useState([]);
       const [form, setForm] = useState({ name: '', price: '', category: '', stock: '' });
       const [errors, setErrors] = useState({});
       const [isLoading, setIsLoading] = useState(false);
       const [apiError, setApiError] = useState('');
       const API_URL = process.env.REACT_APP_API_URL;

       console.log('API_URL:', API_URL); // Debug .env

       const fetchProducts = useCallback(async () => {
         setIsLoading(true);
         try {
           const res = await fetch(`${API_URL}/products`, {
             headers: { Authorization: 'Basic ' + btoa('admin:password') }
           });
           if (!res.ok) throw new Error('Failed to fetch products');
           const data = await res.json();
           setProducts(data);
           setApiError('');
         } catch (error) {
           setApiError(error.message);
         } finally {
           setIsLoading(false);
         }
       }, [API_URL]);

       useEffect(() => {
         fetchProducts();
       }, [fetchProducts]);

       const validateForm = () => {
         const newErrors = {};
         if (!form.name.trim()) newErrors.name = 'Product name is required';
         if (!form.price || form.price <= 0) newErrors.price = 'Price must be a positive number';
         if (!form.category.trim()) newErrors.category = 'Category is required';
         if (!form.stock || form.stock < 0) newErrors.stock = 'Stock must be a non-negative number';
         setErrors(newErrors);
         return Object.keys(newErrors).length === 0;
       };

       const handleSubmit = async (e) => {
         e.preventDefault();
         if (!validateForm()) return;
         setIsLoading(true);
         try {
           const res = await fetch(`${API_URL}/products`, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               Authorization: 'Basic ' + btoa('admin:password')
             },
             body: JSON.stringify({
               ...form,
               price: parseFloat(form.price),
               stock: parseInt(form.stock)
             })
           });
           if (!res.ok) throw new Error('Failed to add product');
           await fetchProducts();
           setForm({ name: '', price: '', category: '', stock: '' });
           setApiError('');
         } catch (error) {
           setApiError(error.message);
         } finally {
           setIsLoading(false);
         }
       };

       const handleChange = (e) => {
         setForm({ ...form, [e.target.name]: e.target.value });
         setErrors({ ...errors, [e.target.name]: '' });
       };

       return (
         <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
           <div className="container bg-white rounded shadow-lg p-4">
             <h1 className="text-center mb-4 text-primary">Product Listing</h1>
             {apiError && (
               <div className="alert alert-danger mb-4" role="alert">
                 {apiError}
               </div>
             )}
             {isLoading && (
               <div className="text-center mb-4">
                 <div className="spinner-border text-primary" role="status">
                   <span className="visually-hidden">Loading...</span>
                 </div>
               </div>
             )}
             <div className="mb-5">
               <h2 className="h4 mb-3">Products</h2>
               {products.length === 0 && !isLoading ? (
                 <p className="text-muted">No products available.</p>
               ) : (
                 <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                   {products.map(product => (
                     <div key={product.id} className="col">
                       <div className="card border-0 shadow-sm">
                         <div className="card-body">
                           <h5 className="card-title">{product.name}</h5>
                           <p className="card-text text-muted">
                             ${product.price.toFixed(2)} | {product.category} | Stock: {product.stock}
                           </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
             <h2 className="h4 mb-3">Add New Product</h2>
             <form onSubmit={handleSubmit} className="card p-4 bg-light shadow-sm">
               <div className="mb-3">
                 <label htmlFor="name" className="form-label">Product Name</label>
                 <input
                   id="name"
                   name="name"
                   value={form.name}
                   onChange={handleChange}
                   placeholder="Enter product name"
                   className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                   required
                 />
                 {errors.name && <div className="invalid-feedback">{errors.name}</div>}
               </div>
               <div className="mb-3">
                 <label htmlFor="price" className="form-label">Price</label>
                 <input
                   id="price"
                   name="price"
                   type="number"
                   step="0.01"
                   value={form.price}
                   onChange={handleChange}
                   placeholder="Enter price"
                   className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                   required
                 />
                 {errors.price && <div className="invalid-feedback">{errors.price}</div>}
               </div>
               <div className="mb-3">
                 <label htmlFor="category" className="form-label">Category</label>
                 <input
                   id="category"
                   name="category"
                   value={form.category}
                   onChange={handleChange}
                   placeholder="Enter category"
                   className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                   required
                 />
                 {errors.category && <div className="invalid-feedback">{errors.category}</div>}
               </div>
               <div className="mb-3">
                 <label htmlFor="stock" className="form-label">Stock</label>
                 <input
                   id="stock"
                   name="stock"
                   type="number"
                   value={form.stock}
                   onChange={handleChange}
                   placeholder="Enter stock"
                   className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                   required
                 />
                 {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
               </div>
               <button
                 type="submit"
                 className="btn btn-secondary w-100"
                 disabled={isLoading}
               >
                 {isLoading ? 'Adding...' : 'Add Product'}
               </button>
             </form>
           </div>
         </div>
       );
     }

     export default App;