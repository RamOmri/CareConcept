import { Switch } from 'react-native-paper';
import {ADD_DOC, DELETE_DOC, SET_IBAN, SET_BIC, SET_ACCOUNT_HOLDER, SET_DATE,  DELETE_STATE} from '../actions/types';

const initState = {
    docList: [],
    IBAN: null,
    BIC: null,
    AccountHolder: null,
    date: 'select'
}

const docReducers = (state = initState, action) =>{
    switch(action.type){
        case ADD_DOC:
            return {
                ...state,
                  docList: state.docList.concat({
                  key: Math.random(),
                  document: action.data
                    }
                )
            
            }

        case DELETE_DOC:
            return{
                ...state,
                  docList: state.docList.filter((item) =>
                  item.key !== action.key)
            }
            case SET_IBAN:
                return{ 
                    ...state,
                        IBAN: action.data 
                    };
                    case SET_BIC:
                        return{ 
                            ...state,
                                BIC: action.data 
                            };
                            case SET_ACCOUNT_HOLDER:
                                return{ 
                                    ...state,
                                        AccountHolder: action.data 
                                    };
                                case SET_DATE:
                                    return{ 
                                        ...state,
                                            date: action.data 
                                        };
                                        case DELETE_STATE:
                                            return{
                                                ...initState
                                            }
            default: 
                return state
    }
}



export default docReducers;