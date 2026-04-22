import { param, body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

export const validateAddToCart = [
    param('productId').isMongoId().withMessage('Invalid product ID'),
    param('variantId').isMongoId().withMessage('Invalid variant ID'),
    body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
    validateRequest
]

export const validateUpdateCart = [
    param('productId').isMongoId().withMessage('Invalid product ID'),
    param('variantId').isMongoId().withMessage('Invalid variant ID'),
    body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
    validateRequest
]