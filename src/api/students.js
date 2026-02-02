import api from '.';
import { ENDPOINTS } from '../constants/api';

export const createStudent = (data) => {
    // Note: User creation in Strapi returns the user directly
    return api.post(ENDPOINTS.USERS, data).then(({ data }) => data);
};

export const getStudents = () => {
    // FIXED: Corrected spelling from 'popluate' to 'populate'
    // AND explicitly asking for 'role'
    return api.get(`${ENDPOINTS.USERS}?populate=role`).then(({ data }) => data);
};

export const getStudent = async (id) => {
    const res = await api
        .get(`${ENDPOINTS.USERS}/${id}?populate=role`) // Explicitly populate role
        .then(({ data }) => data);
    console.log('User details:', res);
    return res;
};

export const updateStudent = (id, data) => {
    // IMPORTANT: Strapi updates use PUT, not POST
    return api.put(`${ENDPOINTS.USERS}/${id}`, data).then(({ data }) => data);
};

export const getStudentHistory = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [];
    //  return dummyHistory[id] || [];
};
