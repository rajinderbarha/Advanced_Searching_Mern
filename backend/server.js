// import express from 'express';
// import bodyParser from 'body-parser';
// import natural from 'natural';
// import cors from 'cors';
// import Fuse from 'fuse.js';
// import { MongoClient } from 'mongodb';
// import translate from 'translate';

// const app = express();
// const port = 8000;

// // Set the translation engine to LibreTranslate
// translate.engine = 'libre';
// translate.key = ''; // No API key needed for LibreTranslate

// let products = [];
// let fuse; // Fuse.js instance

// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection details
// const uri = "mongodb+srv://jskrn:jskrn1911@cluster0.ouwrccx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Update this with your MongoDB Atlas connection string
// const databaseName = "DummyProductData"; // Update this with your database name
// const collectionName = "products"; // Update this with your collection name

// // Synonym map
// const synonyms = {
//     boots: 'shoes',
//     shoes: 'boots',
//     child : 'children',
//     children : 'child',
//     toddlers : 'childs',
//     child : 'toddlers',
//     kids: 'childs',
//     child: 'kids',
//     // Add more synonyms as needed
// };

// // Preprocess product titles for search
// const preprocessTitle = (title) => {
//     if (!title) return '';
//     const tokenizer = new natural.WordTokenizer();
//     let tokens = tokenizer.tokenize(title.toLowerCase());

//     // Replace tokens with their synonyms
//     tokens = tokens.map(token => synonyms[token] || token);

//     const stopWords = ['a', 'an', 'the', 'in', 'on', 'at', 'for', 'and', 'or'];
//     tokens = tokens.filter(token => !stopWords.includes(token));

//     const stemmer = natural.PorterStemmer;
//     tokens = tokens.map(token => stemmer.stem(token));

//     return tokens.join(' ');
// };

// // Read data from MongoDB and populate products array
// const readDataAndIndex = async () => {
//     const client = new MongoClient(uri);
//     try {
//         await client.connect();
//         console.log("Connected to MongoDB");

//         const db = client.db(databaseName);
//         const collection = db.collection(collectionName);

//         const data = await collection.find({}).toArray();

//         products = data.map(item => ({
//             ...item,
//             preprocessed_title: preprocessTitle(item.product_title),
//             preprocessed_description: preprocessTitle(item.product_description)
//         }));

//         // Initialize Fuse.js
//         fuse = new Fuse(products, {
//             keys: [
//                 { name: 'preprocessed_title', weight: 0.7 },
//                 { name: 'preprocessed_description', weight: 0.3 }
//             ],
//             threshold: 0.5, // Lower threshold for stricter matching
//             distance: 250 // Reduce distance for more relevant matches
//         });
//         console.log('Products indexed for search');
//     } catch (err) {
//         console.error('Failed to read data from MongoDB:', err);
//     } finally {
//         await client.close();
//         console.log("MongoDB connection closed");
//     }
// };

// // Function to translate text to the target language
// const translateText = async (text, targetLang) => {
//     try {
//         const translation = await translate(text, { to: targetLang });
//         return translation;
//     } catch (error) {
//         console.error('Error translating text:', error);
//         return text;
//     }
// };

// // Endpoint to fetch products with optional search and pagination
// app.get('/products', async (req, res) => {
//     const { search, page = 1, limit = 50, lang = 'en' } = req.query; // Default language is English
//     const currentPage = parseInt(page);
//     const perPage = parseInt(limit);

//     if (!fuse) {
//         return res.status(503).json({ error: 'Products are still being indexed. Please try again later.' });
//     }

//     let filteredProducts = products;

//     if (search) {
//         // Translate search query to the language of the product data
//         const translatedSearch = await translateText(search, 'en');
//         const searchPreprocessed = preprocessTitle(translatedSearch);
//         const searchTokens = searchPreprocessed.split(' ');

//         // Exact match filtering
//         const exactMatches = products.filter(product => 
//             searchTokens.every(token => 
//                 product.preprocessed_title.includes(token) || 
//                 product.preprocessed_description.includes(token)
//             )
//         );

//         // Fuzzy search with Fuse.js
//         const fuzzyResults = fuse.search(searchPreprocessed);
//         const fuzzyMatches = fuzzyResults.map(result => result.item);

//         // Combine exact matches and fuzzy matches, removing duplicates
//         const combinedResults = [...new Set([...exactMatches, ...fuzzyMatches])];

//         // Ensure results contain all search tokens
//         filteredProducts = combinedResults.filter(product => {
//             const productTokens = product.preprocessed_title.split(' ').concat(product.preprocessed_description.split(' '));
//             return searchTokens.every(token => productTokens.includes(token));
//         });
//     }

//     const startIndex = (currentPage - 1) * perPage;
//     const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);
//     const totalPages = Math.ceil(filteredProducts.length / perPage);

//     res.json({
//         products: paginatedProducts,
//         totalPages: totalPages,
//         currentPage: currentPage,
//         totalProducts: filteredProducts.length
//     });
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//     readDataAndIndex(); // Index data when the server starts
// });




////////////// WORKING  //////////////
const express = require('express');
const bodyParser = require('body-parser');
const natural = require('natural');
const cors = require('cors');
const Fuse = require('fuse.js');
const { MongoClient } = require('mongodb');

const app = express();
const port = 8000;

let products = [];
let fuse; // Fuse.js instance

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection details
const uri = "mongodb+srv://jskrn:jskrn1911@cluster0.ouwrccx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Update this with your MongoDB Atlas connection string
const databaseName = "DummyProductData"; // Update this with your database name
const collectionName = "products"; // Update this with your collection name

// Synonym map
const synonyms = {
   boots: 'shoes',
    shoes: 'boots',
    child : 'children',
    children : 'child',
    toddlers : 'childs',
    child : 'toddlers',
    kids: 'childs',
    child: 'kids',
    tv: 'television',
    television: 'tv',
};

// Preprocess product titles for search
const preprocessTitle = (title) => {
    if (!title) return '';
    const tokenizer = new natural.WordTokenizer();
    let tokens = tokenizer.tokenize(title.toLowerCase());

    // Replace tokens with their synonyms
    tokens = tokens.map(token => synonyms[token] || token);

    const stopWords = ['a', 'an', 'the', 'in', 'on', 'at', 'for', 'and', 'or'];
    tokens = tokens.filter(token => !stopWords.includes(token));

    const stemmer = natural.PorterStemmer;
    tokens = tokens.map(token => stemmer.stem(token));

    return tokens.join(' ');
};

// Read data from MongoDB and populate products array
const readDataAndIndex = async () => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);
        console.log('Reading data from MongoDB...');
        const data = await collection.find({}).toArray();
        console.log('Data Mapping Started...')
        products = data.map(item => ({
            ...item,
            preprocessed_title: preprocessTitle(item.product_title),
            preprocessed_description: preprocessTitle(item.product_description)
        }));

        // Initialize Fuse.js
        console.log('Product Indexing started...')
        fuse = new Fuse(products, {
            keys: [
                { name: 'preprocessed_title', weight: 0.7 },
                { name: 'preprocessed_description', weight: 0.3 }
            ],
            threshold: 0.5, // Lower threshold for stricter matching
            distance: 250 // Reduce distance for more relevant matches
        });
        console.log('Products indexed for search');
    } catch (err) {
        console.error('Failed to read data from MongoDB:', err);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
};

// Endpoint to fetch products with optional search and pagination
app.get('/products', async (req, res) => {
    const { search, page = 1, limit = 50 } = req.query;
    const currentPage = parseInt(page);
    const perPage = parseInt(limit);

    if (!fuse) {
        return res.status(503).json({ error: 'Products are still being indexed. Please try again later.' });
    }

    let filteredProducts = products;

    if (search) {
        const searchPreprocessed = preprocessTitle(search);
        const searchTokens = searchPreprocessed.split(' ');

        // Exact match filtering
        const exactMatches = products.filter(product => 
            searchTokens.every(token => 
                product.preprocessed_title.includes(token) || 
                product.preprocessed_description.includes(token)
            )
        );

        // Fuzzy search with Fuse.js
        const fuzzyResults = fuse.search(searchPreprocessed);
        const fuzzyMatches = fuzzyResults.map(result => result.item);

        // Combine exact matches and fuzzy matches, removing duplicates
        const combinedResults = [...new Set([...exactMatches, ...fuzzyMatches])];

        // Ensure results contain all search tokens
        filteredProducts = combinedResults.filter(product => {
            const productTokens = product.preprocessed_title.split(' ').concat(product.preprocessed_description.split(' '));
            return searchTokens.every(token => productTokens.includes(token));
        });
    }

    const startIndex = (currentPage - 1) * perPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(filteredProducts.length / perPage);

    res.json({
        products: paginatedProducts,
        totalPages: totalPages,
        currentPage: currentPage,
        totalProducts: filteredProducts.length
    });
});

app.get('/', (req, res) => {
   res.send('API ENDPOINTS ARE WORKING');  
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    readDataAndIndex(); // Index data when the server starts
});












///////////SEARCH BASED ON SEMANTIC ANALYSIS & COSINE SIMILARITY////////////
// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const csv = require('csv-parser');
// const natural = require('natural');
// const cors = require('cors');

// const app = express();
// const port = 8000;

// // Initialize arrays and variables
// const products = [];
// let totalProducts = 0; // Total number of products
// let productsPreprocessed = false;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Preprocess product titles for search
// const preprocessTitle = (title) => {
//     if (!title) return '';
    
//     // Tokenize and lowercase
//     const tokens = title.toLowerCase().split(/\s+/);

//     // Remove stop words (example, you may need a list of stop words)
//     const stopWords = ['a', 'an', 'the', 'in', 'on', 'at', 'for', 'and', 'or'];
//     const filteredTokens = tokens.filter(token => !stopWords.includes(token));

//     // Stem tokens
//     const stemmer = natural.PorterStemmer;
//     const stemmedTokens = filteredTokens.map(token => stemmer.stem(token));

//     return stemmedTokens.join(' ');
// };

// // Read CSV and populate products array
// fs.createReadStream('data.csv')
//     .pipe(csv())
//     .on('data', (data) => {
//         products.push({
//             ...data,
//             preprocessed_title: preprocessTitle(data.product_title) // Preprocess title once
//         });
//         totalProducts++;
//     })
//     .on('end', () => {
//         productsPreprocessed = true;
//         console.log('CSV file successfully processed');
//     });

// // Function to calculate cosine similarity
// const cosineSimilarity = (vector1, vector2) => {
//     const intersection = vector1.filter(token => vector2.includes(token));
//     return intersection.length / (Math.sqrt(vector1.length) * Math.sqrt(vector2.length));
// };

// // Endpoint to fetch products with optional search and pagination
// app.get('/products', (req, res) => {
//     if (!productsPreprocessed) {
//         return res.status(503).json({ error: 'Products are still being processed. Please try again later.' });
//     }

//     const { search, page, limit } = req.query;
//     let currentPage = parseInt(page) || 1;
//     const perPage = parseInt(limit) || 50;

//     let filteredProducts = [...products];

//     // Apply intelligent search filter if provided
//     if (search) {
//         const queryTokens = preprocessTitle(search).split(' ');

//         filteredProducts = filteredProducts.filter(product => {
//             const productTokens = product.preprocessed_title.split(' ');
//             try {
//                 const similarity = cosineSimilarity(queryTokens, productTokens);
//                 return similarity > 0.5; // Example threshold
//             } catch (error) {
//                 console.error('Error calculating cosine similarity:', error.message);
//                 return false;
//             }
//         });
//     }

//     // Pagination logic
//     const startIndex = (currentPage - 1) * perPage;
//     const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);
//     const totalPages = Math.ceil(filteredProducts.length / perPage);

//     res.json({
//         products: paginatedProducts,
//         totalPages: totalPages,
//         currentPage: currentPage,
//         totalProducts: filteredProducts.length
//     });
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });























//////////////////// WORKING SIMPLE SEARCH BASED ON TITLE QUERY ////////////////////
// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const csv = require('csv-parser');
// const app = express();
// const port = 8000;
// const cors = require('cors');
// const natural = require('natural');


// const products = [];
// let totalProducts = 0; // Total number of products

// app.use(cors());

// // Read CSV and populate products array
// fs.createReadStream('data.csv')
//     .pipe(csv())
//     .on('data', (data) => {
//         products.push(data);
//         totalProducts++;
//     })
//     .on('end', () => {
//         console.log('CSV file successfully processed');
//     });

// // Endpoint to fetch products with optional search and pagination
// app.get('/products', (req, res) => {
//     const { search, page, limit } = req.query;
//     let currentPage = parseInt(page) || 1;
//     const perPage = parseInt(limit) || 50;

//     let filteredProducts = [...products];

//     // Apply search filter if provided
//     if (search) {
//         filteredProducts = filteredProducts.filter(product =>
//             product.product_title.toLowerCase().includes(search.toLowerCase())
//         );
//     }

//     // Pagination logic
//     const startIndex = (currentPage - 1) * perPage;
//     const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);

//     // Calculate total pages for pagination UI
//     const totalPages = Math.ceil(filteredProducts.length / perPage);

//     res.json({
//         products: paginatedProducts,
//         totalPages: totalPages,
//         currentPage: currentPage,
//         totalProducts: filteredProducts.length
//     });
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });








