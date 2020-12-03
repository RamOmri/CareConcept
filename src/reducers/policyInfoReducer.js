import { Switch } from 'react-native-paper';
import { changeInsuranceNumber } from '../actions/policInfoActions';
import {CHANGE_INSURANCE_NUMBER, CHANGE_GENDER, CHANGE_NAME, CHANGE_SURNAME} from '../actions/types';

const initState = {
    policyInfo: {
        insuranceNumber: '',
        gender: 'select...',
        FirstName: '',
        Surname: ''
    }
}

const policyInfoReducer = (state = initState, action) =>{
    switch(action.type){
        case CHANGE_INSURANCE_NUMBER:
            return{ 
                ...state,
                    policyInfo: {
                        ...state.policyInfo,
                        insuranceNumber: action.data
                    }        
            };
            case CHANGE_GENDER:
                return{ 
                    ...state,
                        policyInfo: {
                            ...state.policyInfo,
                            gender: action.data
                        }        
                    };
                    case CHANGE_NAME:
                        return{ 
                            ...state,
                                policyInfo: {
                                    ...state.policyInfo,
                                    FirstName: action.data
                                }        
                            };
                            case CHANGE_SURNAME:
                                return{ 
                                    ...state,
                                        policyInfo: {
                                            ...state.policyInfo,
                                            Surname: action.data
                                        }        
                                    };
            default: 
                return state
    }
}



export default policyInfoReducer;