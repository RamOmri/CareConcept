import {ADD_DOC, DELETE_DOC, CHANGE_INSURANCE_NUMBER, SET_IBAN, SET_DATE} from './types'

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

export const setIBAN= (iban) =>(
    {
        type: SET_IBAN,
        data: iban
    }
)

export const setDate= (date) =>(
    {
        type: SET_DATE,
        data: date
    }
)