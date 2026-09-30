/**
 * In-Memory Product Database
 *
 * Uses a simple JavaScript array to store product records for this workshop.
 */

const initialProducts = [
  {
    id: 1,
    name: 'Wireless Mechanical Keyboard',
    price: 89.99,
    category: 'Accessories',
    description: 'Compact 75% wireless mechanical keyboard with tactile switches.',
    inStock: true
  },
  {
    id: 2,
    name: 'Ergonomic Wireless Mouse',
    price: 49.99,
    category: 'Accessories',
    description: 'High-precision optical mouse designed for all-day comfort.',
    inStock: true
  },
  {
    id: 3,
    name: '27-Inch 4K IPS Monitor',
    price: 349.99,
    category: 'Monitors',
    description: 'Ultra-sharp 4K UHD monitor with USB-C power delivery.',
    inStock: true
  }
];

// Active in-memory array holding all products
let products = initialProducts.map((product) => ({ ...product }));

// Auto-incrementing ID counter for newly created products
let nextId = 4;

/**
 * Retrieve all products from the in-memory database.
 * @returns {Array<Object>} Shallow copy of all product objects
 */
function findAll() {
  return products.map((product) => ({ ...product }));
}

/**
 * Find a single product by its numeric ID.
 * @param {number} id - Product ID
 * @returns {Object|null} Matching product object or null if not found
 */
function findById(id) {
  const product = products.find((item) => item.id === id);
  return product ? { ...product } : null;
}

/**
 * Insert a new product into the in-memory array.
 * @param {Object} productData - Validated product fields
 * @returns {Object} Newly created product
 */
function create(productData) {
  const newProduct = {
    id: nextId++,
    name: productData.name,
    price: productData.price,
    category: productData.category ?? 'General',
    description: productData.description ?? '',
    inStock: productData.inStock ?? true
  };

  products.push(newProduct);
  return { ...newProduct };
}

/**
 * Replace an existing product completely (PUT).
 * @param {number} id - Product ID to replace
 * @param {Object} productData - Complete replacement fields
 * @returns {Object|null} Updated product or null if not found
 */
function replaceById(id, productData) {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const replacedProduct = {
    id,
    name: productData.name,
    price: productData.price,
    category: productData.category ?? 'General',
    description: productData.description ?? '',
    inStock: productData.inStock ?? true
  };

  products[index] = replacedProduct;
  return { ...replacedProduct };
}

/**
 * Partially update an existing product (PATCH).
 * @param {number} id - Product ID to update
 * @param {Object} updates - Partial fields to merge
 * @returns {Object|null} Updated product or null if not found
 */
function updateById(id, updates) {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const existing = products[index];
  const updatedProduct = {
    ...existing,
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.price !== undefined && { price: updates.price }),
    ...(updates.category !== undefined && { category: updates.category }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.inStock !== undefined && { inStock: updates.inStock }),
    id: existing.id
  };

  products[index] = updatedProduct;
  return { ...updatedProduct };
}

/**
 * Delete a product from the in-memory array by ID.
 * @param {number} id - Product ID to remove
 * @returns {Object|null} Deleted product or null if not found
 */
function deleteById(id) {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [deletedProduct] = products.splice(index, 1);
  return { ...deletedProduct };
}

/**
 * Reset the in-memory database back to its initial state (useful for testing).
 */
function resetDatabase() {
  products = initialProducts.map((product) => ({ ...product }));
  nextId = 4;
}

module.exports = {
  findAll,
  findById,
  create,
  replaceById,
  updateById,
  deleteById,
  resetDatabase
};
