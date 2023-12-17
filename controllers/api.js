const { default: axios } = require("axios");
const Product = require("../models/product");
const Order = require("../models/order");
const Address = require("../models/address");
const Coupon = require("../models/coupon");
const Favorites = require("../models/favorites");
const Category = require("../models/category");

exports.getProducts = async (req, res, next) => {
  try {
    const { skip, limit, langCode } = req.query;
    const products = await Product.find()
      .skip(skip ?? 0)
      .limit(limit ?? 10)
      .exec();
    const totalCount = await Product.countDocuments();
    res.status(200).json({
      products,
      totalCount,
      message: "Products retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ id: productId });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      product,
      message: "Product retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProductImage = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const newImageUri = req.body.imageUri;

    // Find the product by ID and update the imageUri
    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      { $set: { imageUri: newImageUri } },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      const notFoundError = new Error("Product not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    res.status(200).json({
      updatedProduct,
      message: "Product imageUri updated successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getRecommendedProducts = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const response = await axios.get(
      process.env.RECOMMENDATION_SERVICE_URL +
        "/get-recommendations/" +
        productId
    );

    // Extract the data from the response
    const dataFromOtherService = response.data;

    if (!dataFromOtherService) {
      const err = new Error("No IDs returned from the recommendation service");
      notFoundError.statusCode = 500;
      throw err;
    }
    // Find the products by IDs
    const recommendedProducts = await Product.find({
      id: { $in: dataFromOtherService },
    }).exec();

    if (!recommendedProducts) {
      const notFoundError = new Error(
        "Error while fetching recommended products"
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    res.status(200).json({
      recommendedProducts,
      message: "Products IDs fetched successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    // Extract order data from the request body
    const { user, items, address, coupon, totalPrice } = req.body;

    // Create a new order
    const newOrder = new Order({
      user,
      items,
      address,
      coupon,
      totalPrice,
      // Additional fields can be added based on your schema
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({
      order: savedOrder,
      message: "Order created successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    // Extract address data from the request body
    const { user, street, city, state, postalCode, country, title } = req.body;

    console.log(req.body);
    // Create a new address
    const newAddress = new Address({
      title,
      user,
      street,
      city,
      state,
      postalCode,
      country,
      // Additional fields can be added based on your schema
    });

    // Save the address to the database
    const savedAddress = await newAddress.save();

    res.status(201).json({
      address: savedAddress,
      message: "Address created successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAddressesForUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find addresses for the specified user
    const addresses = await Address.find({ user: userId }).exec();

    res.status(200).json({
      addresses,
      message: "Addresses retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller to get a specific address by ID
exports.getAddressById = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;

    // Find the address by ID
    const address = await Address.findById(addressId).exec();

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      address,
      message: "Address retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOrdersForUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find orders for the specified user
    const orders = await Order.find({ user: userId })
      .populate("address")
      .populate({
        path: "items.product",
        model: "Product",
      })
      .exec();

    res.status(200).json({
      orders,
      message: "Orders retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller to get a specific order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID
    const order = await Order.findById(orderId).exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      order,
      message: "Order retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller to check if a coupon is valid and active
exports.checkCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;

    // Find the coupon by code
    const coupon = await Coupon.findOne({ code: couponCode }).exec();

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Check if the coupon is active
    if (!coupon.isActive) {
      return res.status(403).json({ message: "Coupon is not active" });
    }

    // Check additional conditions, such as validity period or total amount constraints
    // Add your specific business logic here

    res.status(200).json({
      coupon,
      message: "Coupon is valid and active",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFavoritesByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find favorites for the specified user
    const favorites = await Favorites.findOne({ user: userId })
      .populate("products")
      .exec();

    if (!favorites) {
      return res
        .status(404)
        .json({ message: "Favorites not found for the user" });
    }

    res.status(200).json({
      favorites,
      message: "Favorites retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addToFavorites = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    // Find or create favorites for the specified user
    let favorites = await Favorites.findOne({ user: userId })
      .populate("products")
      .exec();
    if (!favorites) {
      favorites = new Favorites({ user: userId, products: [] });
    }

    // Add the product to favorites if not already present
    if (!favorites.products.includes(productId)) {
      favorites.products.push(productId);
      await favorites.save();
    }

    res.status(201).json({
      favorites,
      message: "Product added to favorites successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller to remove a product from favorites
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;

    // Find favorites for the specified user
    const favorites = await Favorites.findOne({ user: userId }).exec();

    if (!favorites) {
      return res
        .status(404)
        .json({ message: "Favorites not found for the user" });
    }

    // Remove the product from favorites
    favorites.products = favorites.products.filter(
      (p) => p.toString() !== productId
    );
    await favorites.save();

    res.status(200).json({
      favorites,
      message: "Product removed from favorites successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.deleteAddressById = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;

    // Find and remove the address by ID
    const deletedAddress = await Address.findByIdAndDelete(addressId).exec();

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({
      deletedAddress,
      message: "Address deleted successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const { newStatus } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId).exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order status
    order.orderStatus = newStatus;
    await order.save();

    res.status(200).json({
      updatedOrder: order,
      message: "Order status updated successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;

    // Find products by category
    const products = await Product.find({ category: category }).exec();

    res.status(200).json({
      products,
      message: "Products filtered by category successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().exec();

    res.status(200).json({
      categories,
      message: "Categories retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller to create a new category
exports.createCategory = async (req, res, next) => {
  try {
    const { title, description, imageUrl } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ title }).exec();
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create a new category
    const category = new Category({
      title,
      description,
      imageUrl,
    });

    await category.save();

    res.status(201).json({
      category,
      message: "Category created successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
