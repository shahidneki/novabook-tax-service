import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import taxRoutes from './routes/taxRoutes';
import { logger } from './middleware/logger';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Set the port from environment variable or default to 3000

/**
 * @module App
 * @description Entry point for the Express application. 
 * This module sets up the middleware, routes, and starts the server.
 */

// Middleware to parse JSON request bodies
app.use(bodyParser.json()); 
// Middleware to enable CORS for all routes
app.use(cors()); 
// Custom logging middleware
app.use(logger); 
// Mount tax service routes to the root path
app.use('/', taxRoutes); 

/**
 * @route GET /health
 * @description Health check route for service status.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

/**
 * @description Error handling middleware for unexpected errors.
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
