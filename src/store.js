import {createStore, combineReducers} from 'redux';
import docReducers from './reducers/docReducers'

const rootReducer = combineReducers({
    docs: docReducers
})

const configureStore =  createStore(rootReducer);

export default configureStore;