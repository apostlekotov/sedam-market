import React, { Fragment, useState } from 'react';

const shopList = require('./shop-list.json');

function Map() {
  const [mapLink, setMapLink] = useState({
    active: 'F8R4+V4',
    src:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6889.7972541233585!2d31.30878907003072!3d51.49557677473713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5478098a9a86588f!2z0KHQtdC00LDQvC3QvNCw0YDQutC10YI!5e0!3m2!1sru!2sua!4v1574023973961!5m2!1sru!2sua'
  });

  const { active, src } = mapLink;

  const onClick = e => {
    setMapLink({
      active: e.target.dataset.id,
      src: e.target.dataset.src
    });
  };

  return (
    <section>
      <div className='section-header'>
        <h3>Магазини</h3>
      </div>
      <div className='map'>
        <iframe src={src} frameBorder='0' title='Sedam grocery shops'></iframe>

        <div className='list-wrapper'>
          <div className='shop-list'>
            {shopList.map(place => {
              return (
                <Fragment key={place.id}>
                  <span>{place.town}</span>
                  <ul>
                    {place.shops.map(({ id, address, src }) => {
                      return (
                        <li
                          key={id}
                          className={active === id ? 'active' : null}
                          data-id={id}
                          data-src={src}
                          onClick={e => onClick(e)}
                        >
                          {address}
                        </li>
                      );
                    })}
                  </ul>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Map;
