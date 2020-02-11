import React, { useState, useContext } from 'react';
import ContactsContext from '../../context/contacts/contactsContext';

function ContactForm() {
  const contactsContext = useContext(ContactsContext);

  const { alert, sendMail } = contactsContext;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const { name, email, message } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    sendMail(formData);
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <form onSubmit={e => onSubmit(e)}>
      <div>
        <input
          type='text'
          name='name'
          autoComplete='off'
          size='40'
          placeholder='Іван Тобілевич'
          value={name}
          onChange={e => onChange(e)}
        />
        <label htmlFor='name'>Ім'я</label>
      </div>
      <div>
        <input
          type='email'
          name='email'
          autoComplete='off'
          size='40'
          required
          placeholder='mymail@mail.com'
          value={email}
          onChange={e => onChange(e)}
        />
        <label htmlFor='email'>e-Mail</label>
      </div>
      <div>
        <textarea
          name='message'
          required
          placeholder='Напишіть нам...'
          value={message}
          onChange={e => onChange(e)}
        ></textarea>
        <label htmlFor='message'>Повідомлення</label>
      </div>
      <input
        type='submit'
        className={`btn ${alert !== null && `btn-${alert.success}`}`}
        value={`${alert !== null ? alert.msg : 'Надіслати'}`}
      />
    </form>
  );
}

export default ContactForm;
