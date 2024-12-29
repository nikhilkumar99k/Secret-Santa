
export interface LoginResponse {
    token: string;
    user: {
        user_id: string;
        name: string;
    };
}