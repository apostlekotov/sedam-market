import React from 'react';
import ContactForm from './ContactForm';

const Contacts = () => {
  return (
    <section id='contacts'>
      <div className='section-header'>
        <h3>Контакти</h3>
      </div>
      <div className='contact-form'>
        <ContactForm />
        <div className='contacts-list'>
          <ul>
            <li>
              <a
                href='tel:+0462723476'
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fas fa-phone-alt'></i>(0462) 72-34-76
              </a>
            </li>
            <li>
              <a
                href='https://goo.gl/maps/hahs4v3KpPC3kqhP7'
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fas fa-building'></i> м. Чернігів, вул.
                Інструментальна 5
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
