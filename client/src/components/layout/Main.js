import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

// components
import Spinner from './Spinner';
import SaleEvent from '../sale/SaleEvent';
import Map from '../Map/Map';
import Contacts from './Contacts';

// context
import SaleContext from '../../context/sale/saleContext';

const Main = () => {
  const saleContext = useContext(SaleContext);

  useEffect(() => {
    saleContext.getSingleEvent();
    // eslint-disable-next-line
  }, []);

  const { loading, sales } = saleContext;

  return (
    <>
      <section className='intro'>
        <div>
          <div className='intro-welcome'>
            <h1>Sedam Market</h1>
            <h2>Обирай найкраще</h2>
            <p>
              Лише якісні продовольчі товари вітчизняного виробника та товари
              світових брендів
            </p>
            <Link to='/about' className='btn'>
              Про нас
            </Link>
          </div>
          <div className='intro-img'>
            <img src='/img/intro.png' alt='Мережа магазинів Sedam' />
          </div>
        </div>
        <i className='fas fa-chevron-down'></i>
      </section>

      {sales ? (
        loading ? (
          <Spinner />
        ) : (
          <section className='sales-preview'>
            {sales.map(
              ({
                id,
                name,
                photo,
                description,
                period,
                fontSize,
                products,
              }) => (
                <SaleEvent
                  key={id}
                  id={id}
                  name={name}
                  photo={photo}
                  description={description}
                  period={period}
                  fontSize={fontSize}
                  products={products}
                />
              )
            )}
          </section>
        )
      ) : null}

      <Map />

      <Contacts />
    </>
  );
};

export default Main;
