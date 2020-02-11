import { SET_LOADING, GET_RABOTA_PREVIEW, GET_RABOTA_VACANCY } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_RABOTA_PREVIEW:
      return {
        ...state,
        work: action.payload,
        loading: false
      };
    case GET_RABOTA_VACANCY:
      return {
        ...state,
        vacancy: action.payload,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};
