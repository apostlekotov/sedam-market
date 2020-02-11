const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// @desc      Get products
// @route     GET /api/v1/products
// @route     GET /api/v1/sale/:saleId/products
// @access    Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  if (req.params.saleId) {
    const products = await Product.find({ sale: req.params.saleId });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single product
// @route     GET /api/products/:id
// @access    Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Нічого не знайдено з id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Add course
// @route     POST /api/v1/sales/:saleId/courses
// @access    Private
exports.addProduct = asyncHandler(async (req, res, next) => {
  req.body.sale = req.params.saleId;

  const sale = await Sale.findById(req.params.saleId);

  if (!sale) {
    return next(
      new ErrorResponse(`Нічого не знайдено з id ${req.params.id}`, 404)
    );
  }

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Update product
// @route     PUT /api/v1/products/:id
// @access    Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Нічого не знайдено з id ${req.params.id}`),
      404
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc      Delete product
// @route     DELETE /api/v1/products/:id
// @access    Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Нічого не знайдено з id ${req.params.id}`),
      404
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
