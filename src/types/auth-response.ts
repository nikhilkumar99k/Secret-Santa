
export interface LoginResponse {
    token: string;
    user: {
        username: string;
        name: string;
    };
}

export interface TokenPayload {
    username: string;
    name: string;
    id: string;
  }