/**
 * Product Controller Layer
 *
 * Handles incoming HTTP requests, delegates data operations to the Product Service,
 * manages cache invalidation after successful data mutations, and returns JSON responses.
 */

const productService = require('../services/productService');
const { invalidateProductCache } = require('../middleware/cacheMiddleware');

/**
 * GET /products
 * Fetch all products. (Caching is handled by cacheMiddleware prior to this controller.)
 */
function getAllProducts(req, res, next) {
  try {
    const products = productService.getAllProducts();
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /products/:id
 * Fetch a single product by ID. (Caching is handled by cacheMiddleware prior to this controller.)
 */
function getProductById(req, res, next) {
  try {
    const product = productService.getProductById(req.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with ID ${req.productId} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /products
 * Create a new product and invalidate the product-list cache on success.
 */
function createProduct(req, res, next) {
  try {
    const newProduct = productService.createProduct(req.validatedProduct);

    // Invalidate "products" list cache (and "product-{id}") after successful creation
    invalidateProductCache(newProduct.id);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: newProduct
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * PUT /products/:id
 * Replace an existing product completely and invalidate relevant caches on success.
 */
function replaceProduct(req, res, next) {
  try {
    const updatedProduct = productService.replaceProduct(req.productId, req.validatedProduct);

    if (!updatedProduct) {
      // Do NOT invalidate cache when product does not exist
      return res.status(404).json({
        success: false,
        error: `Product with ID ${req.productId} not found.`
      });
    }

    // Invalidate both "products" and "product-{id}" caches after successful update
    invalidateProductCache(req.productId);

    return res.status(200).json({
      success: true,
      message: 'Product replaced successfully.',
      data: updatedProduct
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * PATCH /products/:id
 * Partially update an existing product and invalidate relevant caches on success.
 */
function updateProduct(req, res, next) {
  try {
    const updatedProduct = productService.updateProduct(req.productId, req.validatedUpdates);

    if (!updatedProduct) {
      // Do NOT invalidate cache when product does not exist
      return res.status(404).json({
        success: false,
        error: `Product with ID ${req.productId} not found.`
      });
    }

    // Invalidate both "products" and "product-{id}" caches after successful partial update
    invalidateProductCache(req.productId);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: updatedProduct
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * DELETE /products/:id
 * Delete an existing product and invalidate relevant caches on success.
 */
function deleteProduct(req, res, next) {
  try {
    const deletedProduct = productService.deleteProduct(req.productId);

    if (!deletedProduct) {
      // Do NOT invalidate cache when product does not exist
      return res.status(404).json({
        success: false,
        error: `Product with ID ${req.productId} not found.`
      });
    }

    // Invalidate both "products" and "product-{id}" caches after successful deletion
    invalidateProductCache(req.productId);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
      data: deletedProduct
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct
};
