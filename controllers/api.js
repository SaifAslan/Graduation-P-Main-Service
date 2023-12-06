const { default: axios } = require("axios");
const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const { skip, limit, langCode } = req.params;
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
      const notFoundError = new Error('Product not found');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    res.status(200).json({
      updatedProduct,
      message: 'Product imageUri updated successfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getRecommendedProducts =  async (req, res, next) => {
  try {
    const productId = req.params.id;

    const response = await axios.get(process.env.RECOMMENDATION_SERVICE_URL+'/get-recommendations/'+productId);

    // Extract the data from the response
    const dataFromOtherService = response.data;

    if (!dataFromOtherService) {
      const err = new Error('No IDs returned from the recommendation service');
      notFoundError.statusCode = 500;
      throw err;
    }
    // Find the products by IDs 
    const recommendedProducts = await Product.find({ id: { $in: dataFromOtherService } }).exec();

    if (!recommendedProducts) {
      const notFoundError = new Error('Error while fetching recommended products');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    res.status(200).json({
      recommendedProducts,
      message: 'Products IDs fetched successfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};