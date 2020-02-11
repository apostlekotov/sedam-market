import React, { useReducer } from 'react';
import axios from 'axios';
import ContactsContext from './contactsContext';
import ContactsReducer from './contactsReducer';
import { SET_ALERT, REMOVE_ALERT } from '../types';

const ContactsState = props => {
  const initialState = {
    alert: null
  };

  const [state, dispatch] = useReducer(ContactsReducer, initialState);

  const setAlert = (success, msg) => {
    const alert = { success, msg };

    dispatch({
      type: SET_ALERT,
      payload: alert
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT }), 5000);
  };

  const sendMail = async mail => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/sendMail/', mail, config);

      const { success, data } = res.data;

      setAlert(success, data);
    } catch (err) {
      const { success, error } = err.response.data;
      setAlert(success, error);
    }
  };

  return (
    <ContactsContext.Provider
      value={{
        alert: state.alert,
        sendMail
      }}
    >
      {props.children}
    </ContactsContext.Provider>
  );
};

export default ContactsState;
