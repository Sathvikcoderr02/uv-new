# UniVendor API Server

This is a standalone API server for the UniVendor application. It provides the backend API endpoints that the frontend application needs to function properly.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your actual database connection string

3. Start the server:
   ```
   npm start
   ```

## Deployment to Render

This API server can be easily deployed to Render.com:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add the `DATABASE_URL` environment variable in the Render dashboard
5. Deploy the service

## API Endpoints

- `GET /api/products/:id` - Get a product by ID
- `GET /api/products/:id/variants` - Get variants for a product

## CORS Configuration

The API is configured to accept requests from all origins. In a production environment, you may want to restrict this to only your frontend domain.
