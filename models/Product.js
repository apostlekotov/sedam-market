const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Введіть назву продукту'],
      unique: true,
      trim: true,
      maxlength: [60, 'Назва не може перевищувати 60 символів']
    },
    salePrice: {
      type: String,
      required: [true, 'Введіть акційну ціну продукту'],
      match: [/^\d+\.\d\d$/, 'Ціна повинна мати 2 цифри після крапки']
    },
    price: {
      type: String,
      required: [true, 'Введіть початкову ціну продукту'],
      match: [/^\d+\.\d\d$/, 'Ціна повинна мати 2 цифри після крапки']
    },
    photo: {
      type: String,
      default: '/img/sales/default-product-img.png'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    sale: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Product', ProductSchema);
