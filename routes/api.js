const express = require("express");

const { body, param } = require("express-validator");

const multer = require("multer");

const router = express.Router();

const {
  getProducts,
  getProduct,
  updateProductImage,
  getRecommendedProducts,
  createOrder,
  createAddress,
  getAddressesForUser,
  getAddressById,
  getOrdersForUser,
  getOrderById,
  checkCoupon,
  getFavoritesByUserId,
  removeFromFavorites,
  addToFavorites,
  deleteAddressById,
  updateOrderStatus,
  getProductsByCategory,
  createCategory,
  getCategories,
} = require("../controllers/api");

router.get(
  "/products",
  //   [param("contentAR").notEmpty().withMessage("langCode is required")],
  getProducts
);

// GET /articles/:id
router.get("/products/:id", getProduct);

router.get('/products/category/:category', getProductsByCategory);


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

router.post('/order/create', createOrder);

router.post('/createAddress', createAddress);

router.get('/order/userOrders/:userId', getOrdersForUser);

router.get('/order/:orderId', getOrderById);

router.put('/order/updateOrderStatus/:orderId', updateOrderStatus);

router.get('/getUserAddresses/:userId', getAddressesForUser);

router.get('/address/:addressId', getAddressById);

router.post('/checkCoupon', checkCoupon);

router.get('/favorites/:userId', getFavoritesByUserId);

router.post('/favorites/add', addToFavorites);

// Define a route to remove a product from favorites
router.post('/favorites/remove', removeFromFavorites);

router.delete('/address/:addressId', deleteAddressById);

router.get('/category', getCategories);

router.post('/category', createCategory);


module.exports = router;
