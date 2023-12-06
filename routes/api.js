const express = require("express");

const { body, param } = require("express-validator");

const multer = require("multer");

const router = express.Router();

const {
  getProducts,
  getProduct,
  updateProductImage,
  getRecommendedProducts,
} = require("../controllers/api");

router.get(
  "/products",
  //   [param("contentAR").notEmpty().withMessage("langCode is required")],
  getProducts
);

// GET /articles/:id
router.get("/products/:id", getProduct);

router.put(
  "/updateProductImage",
  [
    body("productId")
      .notEmpty()
      .isNumeric()
      .withMessage("productId is required"),
      body("imageUrl").notEmpty().isURL().withMessage("Please enter a valid image URI"),
  ],
  updateProductImage
);

router.get("/get-recommendations/:id", getRecommendedProducts);


module.exports = router;
