/**
 * Product Routes
 *
 * Follows the architecture:
 * Route -> Middleware -> Controller -> Service -> Database
 */

const express = require('express');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');
const {
  validateProductId,
  validateFullProduct,
  validatePartialProduct
} = require('../middleware/validateProduct');
const productController = require('../controllers/productController');

const router = express.Router();

// GET /products -> Cache Middleware (key: "products") -> Controller
router.get('/', cacheMiddleware, productController.getAllProducts);

// GET /products/:id -> Validate ID -> Cache Middleware (key: "product-{id}") -> Controller
router.get('/:id', validateProductId, cacheMiddleware, productController.getProductById);

// POST /products -> Validate Body -> Controller (invalidates cache on success)
router.post('/', validateFullProduct, productController.createProduct);

// PUT /products/:id -> Validate ID & Body -> Controller (invalidates cache on success)
router.put('/:id', validateProductId, validateFullProduct, productController.replaceProduct);

// PATCH /products/:id -> Validate ID & Partial Body -> Controller (invalidates cache on success)
router.patch('/:id', validateProductId, validatePartialProduct, productController.updateProduct);

// DELETE /products/:id -> Validate ID -> Controller (invalidates cache on success)
router.delete('/:id', validateProductId, productController.deleteProduct);

module.exports = router;
