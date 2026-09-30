/**
 * Express Application Setup
 *
 * Wires together JSON body parsing, product routes, 404 handling,
 * and centralized error handling middleware.
 */

const express = require('express');
const productRoutes = require('./routes/productRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Built-in middleware to parse incoming JSON payloads
app.use(express.json());

// Mount product endpoints at /products
app.use('/products', productRoutes);

// Handle unmatched routes with a 404 JSON response
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
