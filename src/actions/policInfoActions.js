import {CHANGE_INSURANCE_NUMBER,CHANGE_GENDER, CHANGE_NAME, CHANGE_SURNAME} from './types'

export const changeInsuranceNumber = (insuranceNumber) =>(
    {
        type: CHANGE_INSURANCE_NUMBER,
        data: insuranceNumber
    }
)

export const changeGender = (gender) =>(
    {
        type: CHANGE_GENDER,
        data: gender
    }
)

export const changeName = (name) =>(
    {
        type: CHANGE_NAME,
        data: name
    }
)

export const changeSurname = (surname) =>(
    {
        type: CHANGE_SURNAME,
        data: surname
    }
)

