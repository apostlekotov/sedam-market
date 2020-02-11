const express = require('express');
const {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale
} = require('../controllers/sales');

const Sale = require('../models/Sale');

// Include other resource routers
const productRouter = require('./products');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

const { auth } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:saleId/products', productRouter);

router
  .route('/')
  .get(advancedResults(Sale, 'products'), getSales)
  .post(auth, createSale);

router
  .route('/:id')
  .get(getSale)
  .put(auth, updateSale)
  .delete(auth, deleteSale);

module.exports = router;
