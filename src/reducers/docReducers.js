import { Switch } from 'react-native-paper';
import {ADD_DOC, DELETE_DOC, SET_IBAN, SET_DATE} from '../actions/types';

const initState = {
    docList: [],
    IBAN: null,
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
                    case SET_DATE:
                return{ 
                    ...state,
                        date: action.data 
                    };
            default: 
                return state
    }
}



export default docReducers;