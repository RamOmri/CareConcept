import {Switch} from 'react-native-paper';
import {changeInsuranceNumber} from '../actions/policInfoActions';
import {
  CHANGE_INSURANCE_NUMBER,
  CHANGE_GENDER,
  CHANGE_NAME,
  CHANGE_SURNAME,
  DELETE_STATE,
  SET_LANG
} from '../actions/types';

const initState = {
  policyInfo: {
    insuranceNumber: '',
    gender: 'Select',
    FirstName: '',
    Surname: '',
    language: 'eng'
  },
};

const policyInfoReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_INSURANCE_NUMBER:
      return {
        ...state,
        policyInfo: {
          ...state.policyInfo,
          insuranceNumber: action.data,
        },
      };
    case CHANGE_GENDER:
      return {
        ...state,
        policyInfo: {
          ...state.policyInfo,
          gender: action.data,
        },
      };
    case CHANGE_NAME:
      return {
        ...state,
        policyInfo: {
          ...state.policyInfo,
          FirstName: action.data,
        },
      };
    case CHANGE_SURNAME:
      return {
        ...state,
        policyInfo: {
          ...state.policyInfo,
          Surname: action.data,
        },
      };
      case SET_LANG:
      return {
        ...state,
        policyInfo:{
          ...state.policyInfo,
        language: action.data
      }
      };
    case DELETE_STATE:
      return {
        ...initState,
      };
      

    default:
      return state;
  }
};

export default policyInfoReducer;
