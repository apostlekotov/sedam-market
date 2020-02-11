import { SET_ALERT, REMOVE_ALERT } from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      return {
        ...state,
        alert: action.payload,
        loading: false
      };
    case REMOVE_ALERT:
      return {
        ...state,
        alert: null
      };
    default:
      return state;
  }
};
