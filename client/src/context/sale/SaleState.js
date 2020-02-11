import React, { useReducer } from 'react';
import axios from 'axios';
import SaleContext from './saleContext';
import SaleReducer from './saleReducer';
import { GET_ALL_EVENTS, GET_SINGLE_EVENT, SET_LOADING } from '../types';

const SaleState = props => {
  const initialState = {
    sales: [],
    loading: false
  };

  const [state, dispatch] = useReducer(SaleReducer, initialState);

  // Get all sale events
  const getAllEvents = async () => {
    setLoading();

    const res = await axios.get('http://localhost:5000/api/sales');

    dispatch({
      type: GET_ALL_EVENTS,
      payload: res.data.data
    });
  };

  // Get vacancy
  const getSingleEvent = async () => {
    setLoading();

    const res = await axios.get('http://localhost:5000/api/sales?limit=1');

    dispatch({
      type: GET_SINGLE_EVENT,
      payload: res.data.data
    });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <SaleContext.Provider
      value={{
        sales: state.sales,
        loading: state.loading,
        getAllEvents,
        getSingleEvent,
        setLoading
      }}
    >
      {props.children}
    </SaleContext.Provider>
  );
};

export default SaleState;
