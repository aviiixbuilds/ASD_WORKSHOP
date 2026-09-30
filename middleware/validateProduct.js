/**
 * Request Validation Middleware
 *
 * Validates URL parameters (:id) and request bodies for POST, PUT, and PATCH endpoints.
 * Ensures invalid requests fail early with 400 Bad Request before touching the cache or database.
 */

const ALLOWED_FIELDS = ['name', 'price', 'category', 'description', 'inStock'];

/**
 * Validate that req.params.id is a positive integer.
 */
function validateProductId(req, res, next) {
  const rawId = req.params.id;
  const parsedId = Number(rawId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid product ID. ID must be a positive integer.'
    });
  }

  // Store normalized numeric ID for downstream middleware and controllers
  req.productId = parsedId;
  return next();
}

/**
 * Validate request body for creating (POST) or replacing (PUT) a product.
 * Requires both `name` (non-empty string) and `price` (non-negative number).
 */
function validateFullProduct(req, res, next) {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      error: 'Request body must be a valid JSON object.'
    });
  }

  const { name, price, category, description, inStock } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Product "name" is required and must be a non-empty string.'
    });
  }

  if (typeof price !== 'number' || Number.isNaN(price) || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      success: false,
      error: 'Product "price" is required and must be a non-negative number.'
    });
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      error: 'Product "category" must be a non-empty string when provided.'
    });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Product "description" must be a string when provided.'
    });
  }

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    return res.status(400).json({
      success: false,
      error: 'Product "inStock" must be a boolean when provided.'
    });
  }

  // Normalize string fields
  req.validatedProduct = {
    name: name.trim(),
    price,
    category: category !== undefined ? category.trim() : 'General',
    description: description !== undefined ? description.trim() : '',
    inStock: inStock !== undefined ? inStock : true
  };

  return next();
}

/**
 * Validate request body for partially updating (PATCH) a product.
 * Requires at least one valid updatable field.
 */
function validatePartialProduct(req, res, next) {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      error: 'Request body must be a valid JSON object.'
    });
  }

  const providedKeys = Object.keys(body);
  const validKeys = providedKeys.filter((key) => ALLOWED_FIELDS.includes(key));

  if (validKeys.length === 0) {
    return res.status(400).json({
      success: false,
      error: `At least one valid field is required for update: ${ALLOWED_FIELDS.join(', ')}.`
    });
  }

  const updates = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product "name" must be a non-empty string.'
      });
    }
    updates.name = body.name.trim();
  }

  if (body.price !== undefined) {
    if (
      typeof body.price !== 'number' ||
      Number.isNaN(body.price) ||
      !Number.isFinite(body.price) ||
      body.price < 0
    ) {
      return res.status(400).json({
        success: false,
        error: 'Product "price" must be a non-negative number.'
      });
    }
    updates.price = body.price;
  }

  if (body.category !== undefined) {
    if (typeof body.category !== 'string' || body.category.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product "category" must be a non-empty string.'
      });
    }
    updates.category = body.category.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Product "description" must be a string.'
      });
    }
    updates.description = body.description.trim();
  }

  if (body.inStock !== undefined) {
    if (typeof body.inStock !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Product "inStock" must be a boolean.'
      });
    }
    updates.inStock = body.inStock;
  }

  req.validatedUpdates = updates;
  return next();
}

module.exports = {
  validateProductId,
  validateFullProduct,
  validatePartialProduct
};
