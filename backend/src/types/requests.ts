export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    schoolId: string;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    schoolId?: string;
}

// Add params types
export interface UserParams {
    uid: string;
}
