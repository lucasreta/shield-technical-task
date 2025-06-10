import 'express';

declare module 'express' {
  interface Request {
    id?: string;
    user?: {
      userId: string;
      email?: string;
    };
  }
}
