import api from ".";
import { ENDPOINTS } from "../constants/api";

export const me = () => {
    return api
        .get(`${ENDPOINTS.USERS}/me?populate=role`)
        .then(({ data }) => data);
};
