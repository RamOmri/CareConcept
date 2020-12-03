import {createStore, combineReducers} from 'redux';
import docReducers from './reducers/docReducers'
import policyInfoReducer from './reducers/policyInfoReducer'

const rootReducer = combineReducers({
    docReducer: docReducers,
    policyInfoReducers: policyInfoReducer
})

const configureStore =  createStore(rootReducer);

export default configureStore;