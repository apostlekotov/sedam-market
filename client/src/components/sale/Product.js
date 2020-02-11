import React from 'react';
import PropTypes from 'prop-types';

const Product = ({ product, period }) => {
  const { name, photo, salePrice, price } = product;

  return (
    <div className='product'>
      <div className='product-img'>
        <img src={photo} alt={name} />
      </div>
      <span className='product-name'>{name}</span>
      <div className='product-price'>
        <span>{salePrice.split('.')[0]}</span>
        <div>
          <span>{salePrice.split('.')[1]}</span>
          <span>{price}</span>
        </div>
      </div>
      <span className='product-period'>{period}</span>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired
};

export default Product;
