const express = require('express');
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products');

const Product = require('../models/Product');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

const { auth } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'sale',
      select: 'name description photo'
    }),
    getProducts
  )
  .post(auth, addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(auth, updateProduct)
  .delete(auth, deleteProduct);

module.exports = router;
