import api from '.';
import { ENDPOINTS } from '../constants/api';

export const getActivitySession = async (id) => {
    return api
        .get(`${ENDPOINTS.ACTIVITY_SESSIONS}/${id}?populate=*`)
        .then(({ data }) => data?.data);
};
