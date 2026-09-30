/**
 * Product Service Layer
 *
 * Encapsulates business logic and communicates between the Controller
 * and the in-memory Database layer.
 */

const productsDb = require('../database/productsDb');

/**
 * Fetch all products.
 * @returns {Array<Object>} List of all products
 */
function getAllProducts() {
  return productsDb.findAll();
}

/**
 * Fetch a single product by ID.
 * @param {number} id - Numeric product ID
 * @returns {Object|null} Product object or null if not found
 */
function getProductById(id) {
  return productsDb.findById(id);
}

/**
 * Create a new product.
 * @param {Object} productData - Validated product payload
 * @returns {Object} Created product
 */
function createProduct(productData) {
  return productsDb.create(productData);
}

/**
 * Replace an entire product record by ID (PUT).
 * @param {number} id - Numeric product ID
 * @param {Object} productData - Validated complete product payload
 * @returns {Object|null} Replaced product or null if not found
 */
function replaceProduct(id, productData) {
  return productsDb.replaceById(id, productData);
}

/**
 * Partially update a product record by ID (PATCH).
 * @param {number} id - Numeric product ID
 * @param {Object} updates - Validated partial product fields
 * @returns {Object|null} Updated product or null if not found
 */
function updateProduct(id, updates) {
  return productsDb.updateById(id, updates);
}

/**
 * Delete a product record by ID.
 * @param {number} id - Numeric product ID
 * @returns {Object|null} Deleted product or null if not found
 */
function deleteProduct(id) {
  return productsDb.deleteById(id);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct
};
