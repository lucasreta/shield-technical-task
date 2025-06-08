import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../middleware/error.middleware';

describe('Error Middleware', () => {
  it('handles unexpected errors and returns 500', async () => {
    const app = express();
    app.get('/boom', () => {
      throw new Error('Unexpected');
    });
    app.use(errorHandler);

    const res = await request(app).get('/boom');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });
});
