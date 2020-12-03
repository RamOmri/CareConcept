import { Switch } from 'react-native-paper';
import {ADD_DOC, DELETE_DOC} from '../actions/types';

const initState = {
    docList: [],
}

const docReducers = (state = initState, action) =>{
    switch(action.type){
        case ADD_DOC:
            return {
                ...state,
                  docList: state.docList.concat({
                  key: Math.random(),
                  pages: action.data
                    }
                )
            
            }

        case DELETE_DOC:
            return{
                ...state,
                  docList: state.docList.filter((item) =>
                  item.key !== action.key)
            };
            default: 
                return state
    }
}



export default docReducers;