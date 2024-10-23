import { Request, Response, RequestHandler } from 'express';
import { taxService } from '../services/taxServices';

/**
 * @function queryTaxPosition
 * @description Controller for querying the tax position based on the provided date.
 * @param {Request} req - The request object containing query parameters.
 * @param {Response} res - The response object to send the result.
 */
export const queryTaxPosition: RequestHandler = (req: Request, res: Response): void => {
    
    // Extract the date query parameter from the request
    const { date } = req.query;

    // Validate date query parameter
    if (typeof date !== 'string' || !date) {
        res.status(400).json({ error: 'Date is required and must be a valid string' });
        return;
    }

    // Check if the date is in a valid format
    if (isNaN(Date.parse(date))) {
        res.status(400).json({ error: 'Invalid date format. Please use ISO 8601 format.' });
        return;
    }

    try {
        // Calculate the tax position using the provided date
        const taxPosition = taxService.queryTaxPosition(date);
        // Respond with the calculated tax position
        res.status(200).json({ date, taxPosition });
    } catch (error: unknown) {
        console.error('Error querying tax position:', (error as Error).message || error);
        // Handle any errors that occur during tax position calculation
        res.status(500).json({ error: 'Failed to calculate tax position', details: (error as Error).message || 'Unknown error' });
    }
};
