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
                href='https://kotov.com.ua/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fas fa-envelope'></i> feedback@sedam.com.ua
              </a>
            </li>
            <li>
              <a
                href='https://kotov.com.ua/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fas fa-phone-alt'></i>(0462) 72-34-76
              </a>
            </li>
            <li>
              <a
                href='https://kotov.com.ua/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fas fa-building'></i> м. Чернігів, вул.
                Інструментальна 5
              </a>
            </li>
            <li>
              <a
                href='https://kotov.com.ua/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <i className='fab fa-facebook-square'></i> facebook.com/sedam
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
