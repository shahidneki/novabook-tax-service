import { Request, Response, NextFunction } from 'express';

/**
 * @function logger
 * @description Middleware function that logs the HTTP method, URL, and response status code of incoming requests.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function to call.
 * @returns {void} 
 */
export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now(); // Record the start time

  // Set up a listener for the response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime; // Calculate duration
    console.log(JSON.stringify({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    }));
  });

  next(); // Pass control to the next middleware function
};
