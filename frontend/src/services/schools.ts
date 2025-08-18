import { apiUrl, authAxios } from '@/services/index';

const baseUrl = apiUrl + '/schools';

export interface School {
    _id?: string;
    name: string;
    address: string;
    principalName: string;
    email: string;
    phone: string;
    type: 'government' | 'private';
    city: string;
    state: string;
    pinCode: string;
    establishedYear: number;
    createdAt?: string;
    updatedAt?: string;
}

export const getSchools = async (): Promise<School[]> => {
    const response = await authAxios.get(baseUrl);
    return response.data;
};

export const getSchool = async (id: string): Promise<School> => {
    const response = await authAxios.get(`${baseUrl}/${id}`);
    return response.data;
};

export const createSchool = async (data: Omit<School, '_id' | 'createdAt' | 'updatedAt'>): Promise<School> => {
    const response = await authAxios.post(baseUrl, data);
    return response.data;
};

export const updateSchool = async (id: string, data: Partial<School>): Promise<School> => {
    const response = await authAxios.put(`${baseUrl}/${id}`, data);
    return response.data;
};

export const deleteSchool = async (id: string): Promise<void> => {
    const response = await authAxios.delete(`${baseUrl}/${id}`);
    return response.data;
};
