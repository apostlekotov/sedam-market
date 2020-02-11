import { GET_ALL_EVENTS, GET_SINGLE_EVENT } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_ALL_EVENTS:
      return {
        ...state,
        sales: action.payload,
        loading: false
      };
    case GET_SINGLE_EVENT:
      return {
        ...state,
        sales: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
