import { Switch } from 'react-native-paper';
import {ADD_DOC, DELETE_DOC} from '../actions/types';

const initState = {
    docList: []
}

const docReducer = (state = initState, action) =>{
    switch(action.type){
        case ADD_DOC:
            return {
                ...state,
                doctList: state.docList.concat({
                    key: Math.random(),
                    name: action.data
                })
            
            }

        case DELETE_DOC:
            return{
                ... state,
                docList: state.foodList.splice(action.data, 1)
            };
        default:
            return state;
    }
}

export default docReducer;