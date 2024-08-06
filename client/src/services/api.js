import {BACKEND} from './helperurl';
import { commonrequest } from './apicalls';

export const register=async(data)=>{
    return await commonrequest("POST",`${BACKEND}/register`,data);
}


export const sendotp=async(data)=>{
    return await commonrequest("POST",`${BACKEND}/sendotp`,data);
}


export const verifyotp=async(data)=>{
    return await commonrequest("POST",`${BACKEND}/verifyotp`,data);
}

export const getdetails=async()=>{
    return await commonrequest("GET",`${BACKEND}/getdata`)
}





