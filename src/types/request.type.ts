

import { Request } from 'express';

export interface CustomRequestWithUser extends Request {
  user?: {
    id: string;
    username: string;
    name: string;
  };
}
