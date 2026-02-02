import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import API_BASE_URL from '../config';
import { ENDPOINTS } from '../constants/api';

export const useLogin = () => {
    return useMutation(({ identifier, password }) => 
        axios.post(`${API_BASE_URL}/${ENDPOINTS.AUTH_LOCAL}/`, { identifier, password }).then(res => res.data)
    );
};

export const useChangePassword = () => {
    return useMutation(({ user_id, new_password }) => 
        axios.post(`${API_BASE_URL}/change-password`, { user_id, new_password }).then(res => res.data)
    );
};
