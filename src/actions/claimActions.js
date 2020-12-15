import {ADD_DOC, DELETE_DOC, CHANGE_INSURANCE_NUMBER} from './types'

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

export const changeInsuranceNumber = (insuranceNumber) =>(
    {
        type: CHANGE_INSURANCE_NUMBER,
        data: insuranceNumber
    }
)