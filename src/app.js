"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const taxRoutes_1 = __importDefault(require("./routes/taxRoutes"));
const logger_1 = require("./middleware/logger");
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; // Set the port from environment variable or default to 3000
/**
 * @module App
 * @description Entry point for the Express application.
 * This module sets up the middleware, routes, and starts the server.
 */
// Middleware to parse JSON request bodies
app.use(body_parser_1.default.json());
// Middleware to enable CORS for all routes
app.use((0, cors_1.default)());
// Custom logging middleware
app.use(logger_1.logger);
// Mount tax service routes to the root path
app.use('/', taxRoutes_1.default);
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
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
