const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Введіть назву акції'],
      unique: true,
      trim: true,
      maxlength: [40, 'Назва не може перевищувати 40 символів']
    },
    description: {
      type: String,
      required: [true, 'Введіть опис акції'],
      maxlength: [500, 'Опис не може перевищувати 500 символів']
    },
    period: {
      type: String,
      required: [true, 'Введіть період акції'],
      match: [
        /^([0-2]\d|(3)[0-1])(\.)(((0)\d)|((1)\d))(\.)\d{4}(\s\-\s)([0-2]\d|(3)[0-1])(\.)(((0)\d)|((1)\d))(\.)\d{4}$/,
        'Введіть дійсний період'
      ]
    },
    photo: {
      type: String,
      default: '/img/sales/default-sale-img.jpg'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Cascade delete products when a sale is deleted
SaleSchema.pre('remove', async function(next) {
  console.log(`Продукти видаленні з акційної події ${this._id}`);
  await this.model('Product').deleteMany({ sale: this._id });
  next();
});

// Reverse populate with virtuals
SaleSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'sale',
  justOne: false
});

module.exports = mongoose.model('Sale', SaleSchema);
