// 'use client'
// // App.js
// // App.js
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import Spinner from 'react-bootstrap/Spinner';
// import './globals.css';
// import NoImage from '../assets/no.jpg';
// import Link from 'next/link';

// function App() {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage]); 

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:8000/products`, {
//         params: {
//           search: searchTerm,
//           page: currentPage,
//           limit: 50 
//         }
//       });
//       const { products: fetchedProducts, totalPages, currentPage: fetchedPage } = response.data;

//       if (fetchedPage === 1) {
//         setProducts(fetchedProducts);
//       } else {
//         setProducts([...products, ...fetchedProducts]);
//       }

//       setTotalPages(totalPages);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       alert('Failed to fetch products. Please try again later.');
//     }
//     setLoading(false);
//   };

//   const loadMore = () => {
//     setCurrentPage(currentPage + 1);
//   };

//   const handleSearch = async () => {
//     if (!searchTerm) {
//       alert('Please enter a search term.');
//       return;
//     }
//     setLoading(true);
//     try {
//       setCurrentPage(1);
//       const response = await axios.get(`http://localhost:8000/products`, {
//         params: {
//           search: searchTerm,
//           page: 1,
//           limit: 50
//         }
//       });
//       setProducts(response.data.products);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error('Error searching products:', error);
//       alert('Failed to search products. Please try again later.');
//     }
//     setLoading(false);
//   };

//   const handleChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <div className="App">
//       <div className="search-bar">
//         <div>
//           <h1><Link style={{ textDecoration: "none", color: "#4caf50" }} href='#'>E-commerce App</Link></h1>
//         </div>
//         <div>
          
//           <input type="text" value={searchTerm} onChange={handleChange} className="search-input" placeholder="Search products..." />
//           <button onClick={handleSearch} className="search-button">Search</button>
//         </div>
//       </div>
//       <div style={{ paddingTop: "100px" }}>
//         {!loading && <div style={{ padding: "0px 100px" }}>
//           <h4><b>Search term: </b><span style={{ textDecoration: "underline" }}>{searchTerm}</span></h4>
//         </div>}
//         <ul className="cards">
//           {products.map(product => (
//             <div key={product._unit_id} className="card">
//               <img src={product.product_image || NoImage} alt={product.product_title} />
//               <h3>{product.product_title}</h3>
//               <p>Price: {product.product_price}</p>
//               <p>Description: {truncateDescription(product.product_description)}</p>
//               <p>Source: {product.source}</p>
//             </div>
//           ))}
//         </ul>
//         {loading && (
//           <div className="spinner-container">
//             <Spinner style={{ width: '100px', height: '100px' }} animation="border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//           </div>
//         )}
//         {currentPage < totalPages && !loading && (
//           <div className="load-more-container">
//             <button onClick={loadMore}>Load More</button>
//           </div>
//         )}
//         {!loading && currentPage >= totalPages && (
//           <p className="load-more-container">No more products to load.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// function truncateDescription(description) {
//   const words = description.split(' ');
//   if (words.length > 50) {
//     return words.slice(0, 50).join(' ') + '...';
//   }
//   return description;
// }

// export default App;


'use client'
// frontend/src/app/page.jsx

import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './globals.css';
import NoImage from '../assets/no.jpg';
import Link from 'next/link';



function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const API_URL = 'https://advanced-searching-mern-backend.onrender.com';

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]); // Include searchTerm dependency to trigger search updates

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        params: {
          search: searchTerm,
          page: currentPage,
          limit: 50,
        },
      });
      const { products: fetchedProducts, totalPages, currentPage: fetchedPage } = response.data;

      if (fetchedPage === 1) {
        setProducts(fetchedProducts);
      } else {
        setProducts([...products, ...fetchedProducts]);
      }

      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products. Please try again later.');
    }
    setLoading(false);
  };

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      alert('Please enter a search term.');
      return;
    }
    setLoading(true);
    try {
      setCurrentPage(1);
      const response = await axios.get(`${API_URL}/api/products`, {
        params: {
          search: searchTerm,
          page: 1,
          limit: 50,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error searching products:', error);
      alert('Failed to search products. Please try again later.');
    }
    setLoading(false);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="App">
      <div className="search-bar">
        <div>
          <h1>
            <Link style={{ textDecoration: 'none', color: '#4caf50' }} href="#">
              E-commerce App
            </Link>
          </h1>
        </div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            className="search-input"
            placeholder="Search products..."
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>
      <div style={{ paddingTop: '100px' }}>
        {!loading && (
          <div style={{ padding: '0px 100px' }}>
            <h4>
              <b>Search term: </b>
              <span style={{ textDecoration: 'underline' }}>{searchTerm}</span>
            </h4>
          </div>
        )}
        <ul className="cards">
          {products.map((product) => (
            <div key={product._unit_id} className="card">
              <img src={product.product_image || NoImage} alt={product.product_title} />
              <h3>{product.product_title}</h3>
              <p>Price: {product.product_price}</p>
              <p>Description: {truncateDescription(product.product_description)}</p>
              <p>Source: {product.source}</p>
            </div>
          ))}
        </ul>
        {loading && (
          <div className="spinner-container">
            <Spinner style={{ width: '100px', height: '100px' }} animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {currentPage < totalPages && !loading && (
          <div className="load-more-container">
            <button onClick={loadMore}>Load More</button>
          </div>
        )}
        {!loading && currentPage >= totalPages && (
          <p className="load-more-container">No more products to load.</p>
        )}
      </div>
    </div>
  );
}

function truncateDescription(description) {
  const words = description.split(' ');
  if (words.length > 50) {
    return words.slice(0, 50).join(' ') + '...';
  }
  return description;
}

export default App;
