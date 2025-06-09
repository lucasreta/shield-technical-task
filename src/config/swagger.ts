import 'zod-openapi/extend';
import { z } from 'zod';
import { createDocument } from 'zod-openapi';
import { signInSchema, signUpSchema, userSchema } from '@validators/auth.validator';
import { walletSchema } from '@validators/wallet.validator';

export const swaggerSpec = createDocument({
  openapi: '3.0.0',
  info: {
    title: 'Shield API',
    version: '1.0.0',
    description: 'Auto-generated OpenAPI from Zod schemas',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/signin': {
      post: {
        summary: 'Sign in a user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: signInSchema.openapi({ title: 'SignInInput' }),
            },
          },
        },
        responses: {
          '200': {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: z
                  .object({
                    token: z.string().openapi({ example: 'jwt.token.here' }),
                  })
                  .openapi({ title: 'SignInResponse' }),
              },
            },
          },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/signup': {
      post: {
        summary: 'Register new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: signUpSchema.openapi({ title: 'SignUpInput' }),
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered',
            content: {
              'application/json': {
                schema: userSchema
                  .pick({ id: true, email: true })
                  .openapi({ title: 'SignUpResponse' }),
              },
            },
          },
          '409': { description: 'Email already in use' },
        },
      },
    },
    '/wallets': {
      get: {
        summary: 'List wallets',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Wallets list',
            content: {
              'application/json': {
                schema: walletSchema.array().openapi({ title: 'WalletList' }),
              },
            },
          },
        },
      },
      post: {
        summary: 'Create wallet',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: walletSchema.openapi({ title: 'CreateWalletInput' }),
            },
          },
        },
        responses: {
          '201': {
            description: 'Created wallet',
            content: {
              'application/json': {
                schema: walletSchema.openapi({ title: 'Wallet' }),
              },
            },
          },
        },
      },
    },
    '/wallets/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      get: {
        summary: 'Get wallet by ID',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Found wallet',
            content: {
              'application/json': {
                schema: walletSchema.openapi({ title: 'Wallet' }),
              },
            },
          },
          '404': { description: 'Wallet not found' },
        },
      },
      put: {
        summary: 'Update wallet',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: walletSchema.partial().openapi({ title: 'UpdateWalletInput' }),
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated wallet',
            content: {
              'application/json': {
                schema: walletSchema.openapi({ title: 'Wallet' }),
              },
            },
          },
          '404': { description: 'Wallet not found' },
        },
      },
      delete: {
        summary: 'Delete wallet',
        tags: ['Wallets'],
        security: [{ bearerAuth: [] }],
        responses: {
          '204': {
            description: 'Deleted wallet',
          },
          '404': { description: 'Wallet not found' },
        },
      },
    },
  },
});
