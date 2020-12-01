import {createStore, combineReducers} from 'redux';
import docReducers from './reducers/docReducers'

const rootReducer = combineReducers({
    docReducer: docReducers
})

const configureStore =  createStore(rootReducer);

export default configureStore;