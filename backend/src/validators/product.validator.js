import { body, validationResult } from "express-validator"

function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

export const validateCreateProduct = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("priceAmount")
    .isFloat({ gt: 0 })
    .withMessage("Price amount must be a positive number"),
  body("priceCurrency")
    .optional()
    .isString()
    .withMessage("Price currency must be a string"),
  validateRequest,
]

export const validateCreateVariant = [
  body("priceAmount")
    .optional({ values: "falsy" })
    .isFloat({ gt: 0 })
    .withMessage("Variant price amount must be a positive number"),
  body("priceCurrency")
    .optional()
    .isIn(["USD", "EUR", "INR", "GBP", "JPY"])
    .withMessage("Invalid variant currency"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("attributes").custom((value) => {
    if (value === undefined || value === null || value === "") {
      throw new Error("At least one attribute is required")
    }

    if (typeof value === "object") {
      if (Array.isArray(value) || Object.keys(value).length === 0) {
        throw new Error("At least one attribute is required")
      }
      return true
    }
    if (typeof value === "string") {
      let parsed
      try {
        parsed = JSON.parse(value)
      } catch {
        throw new Error("Attributes string must be valid JSON object")
      }

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Attributes string must be valid JSON object")
      }

      if (Object.keys(parsed).length === 0) {
        throw new Error("At least one attribute is required")
      }

      return true
    }
    throw new Error("Attributes must be an object")
  }),
  validateRequest,
]

export const validateUpdateVariantStock = [
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  validateRequest,
]
