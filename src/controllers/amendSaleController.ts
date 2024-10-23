import { Request, Response, RequestHandler } from 'express';
import { taxService } from '../services/taxServices';
import { Amendment } from '../models/transaction';

/**
 * @function amendSale
 * @description Handles the amendment of a sale event.
 *
 * @param {Request} req - The HTTP request object, containing the amendment data in the body.
 * @param {Response} res - The HTTP response object used to send responses back to the client.
 */
export const amendSale: RequestHandler = (req: Request, res: Response): void => {
    const amendment: Amendment = req.body;

    // Validate amendment payload
    if (!amendment || !amendment.date || !amendment.invoiceId || !amendment.itemId) {
        res.status(400).json({ error: 'Invalid amendment payload' });
        return;
    }

    try {
        // Pass the amendment to the tax service for processing
        taxService.amendSale(amendment);
        
        // Send a 202 Accepted response to indicate successful amendment
        res.sendStatus(202);
    } catch (error: unknown) {
        console.error('Error amending sale:', (error as Error).message || error);

        // Send a 500 Internal Server Error response with details about the error if amendment fails
        res.status(500).json({ error: 'Failed to amend sale', details: (error as Error).message || 'Unknown error' });
    }
};
