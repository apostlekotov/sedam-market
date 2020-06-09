import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SaleEvent from './SaleEvent';
import Spinner from '../layout/Spinner';
import SaleContext from '../../context/sale/saleContext';

const Sales = () => {
  const saleContext = useContext(SaleContext);

  useEffect(() => {
    saleContext.getAllEvents();
    // eslint-disable-next-line
  }, []);

  const { loading, sales } = saleContext;

  return (
    <>
      <Helmet>
        <title>Седам Маркет - Акції</title>
      </Helmet>

      <section className='sales'>
        <div className='section-header'>
          <h1>Sedam</h1>
          <h2>Акції</h2>
        </div>

        {sales ? (
          loading ? (
            <Spinner />
          ) : (
            sales.map(
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
            )
          )
        ) : (
          <p>На жаль, акційних пропозицій зараз нема...</p>
        )}
      </section>
    </>
  );
};

export default Sales;
