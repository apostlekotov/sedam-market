import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Product from './Product';

const SaleEvent = ({ id, name, photo, description, period, products }) => {
  return (
    <div className='sale-event'>
      <div className='sale-banner'>
        <img src={photo} alt={name} />
        <div>
          <span>{name}</span>
          <p>{description}</p>
        </div>
      </div>
      <input type='checkbox' id={`event-${id}`} className='onoff-sale'></input>
      <div className='sale-products'>
        <div className='sale-grid'>
          {products.map(product => (
            <Product key={product.id} product={product} period={period} />
          ))}
        </div>
      </div>
      <Link to='/sales' className='btn'>
        Більше акцій
      </Link>
      <label htmlFor={`event-${id}`} className='btn'></label>
    </div>
  );
};

SaleEvent.propType = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired
};

export default SaleEvent;
