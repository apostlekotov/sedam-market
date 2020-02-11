const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Sale = require('../models/Sale');

// @desc      Get all sale events
// @route     GET /api/sales
// @access    Public
exports.getSales = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single sale event
// @route     GET /api/sales/:id
// @access    Public
exports.getSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);

  if (!sale) {
    return next(
      new ErrorResponse(`Нічого не знайдено з id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: sale
  });
});

// @desc      Create sale event
// @route     POST /api/sales
// @access    Private
exports.createSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.create(req.body);

  res.status(201).json({
    success: true,
    data: sale
  });
});

// @desc      Update sale event
// @route     PUT /api/sales/:id
// @access    Private
exports.updateSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!sale) {
    return next(
      new ErrorResponse(`Нічого не знайдено з id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: sale
  });
});

// @desc      Delete sale event
// @route     DELETE /api/sales/:id
// @access    Private
exports.deleteSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findByIdAndDelete(req.params.id);

  if (!sale) {
    return next(
      new ErrorResponse(`Нічого не знайдено з id ${req.params.id}`, 404)
    );
  }

  await sale.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
