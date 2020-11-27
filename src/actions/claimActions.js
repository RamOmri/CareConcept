import {ADD_DOC, DELETE_DOC} from './types'

export const addDoc = (doc) =>(
    {
        type: ADD_DOC,
        data: doc
    }
);

export const deleteDoc = (key) =>(
   {
     type: DELETE_DOC,
     key: key
    }
);