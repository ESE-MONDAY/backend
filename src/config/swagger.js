import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Watchlist API',
      version: '1.0.0',
      description: 'A comprehensive API for managing movies and user watchlists with authentication',
      contact: {
        name: 'Ese Monday',
        email: 'ese@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User UUID',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Movie: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Movie UUID',
            },
            title: {
              type: 'string',
              example: 'The Shawshank Redemption',
            },
            overview: {
              type: 'string',
              example: 'Two imprisoned men bond over a number of years...',
            },
            releaseYear: {
              type: 'integer',
              example: 1994,
            },
            genres: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Drama', 'Crime'],
            },
            runtime: {
              type: 'integer',
              example: 142,
            },
            posterUrl: {
              type: 'string',
              example: 'https://image.tmdb.org/t/p/w342/...',
            },
            createdBy: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        WatchlistItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            movieId: {
              type: 'string',
            },
            userId: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['watching', 'completed', 'dropped'],
              example: 'watching',
            },
            rating: {
              type: 'number',
              example: 8.5,
            },
            addedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/authRoutes.js',
    './src/routes/movieRoutes.js',
    './src/routes/watchlistRoutes.js',
  ],
};

export const swaggerSpecs = swaggerJsdoc(options);
