import React, { useReducer } from 'react';
import axios from 'axios';
import RabotaContext from './rabotaContext';
import RabotaReducer from './rabotaReducer';
import { GET_RABOTA_PREVIEW, GET_RABOTA_VACANCY, SET_LOADING } from '../types';

const company = '339772';

const RabotaState = props => {
  const initialState = {
    work: [],
    vacancy: {},
    loading: false
  };

  const [state, dispatch] = useReducer(RabotaReducer, initialState);

  // Get all vacancies preview
  const getRabotaPreview = async () => {
    setLoading();

    const res = await axios.get(
      `https://ua-api.rabota.ua/company/${company}/vacancies?count=1000`
    );

    dispatch({
      type: GET_RABOTA_PREVIEW,
      payload: res.data.documents
    });
  };

  // Get vacancy
  const getRabotaVacancy = async id => {
    setLoading();

    const res = await axios.get(
      `https://ua-api.rabota.ua/vacancy?id=${id}&ukrainian=true'`
    );

    dispatch({
      type: GET_RABOTA_VACANCY,
      payload: res.data
    });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <RabotaContext.Provider
      value={{
        work: state.work,
        vacancy: state.vacancy,
        loading: state.loading,
        getRabotaPreview,
        getRabotaVacancy,
        setLoading
      }}
    >
      {props.children}
    </RabotaContext.Provider>
  );
};

export default RabotaState;
