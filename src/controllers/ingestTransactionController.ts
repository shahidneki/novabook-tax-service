import { Request, Response, RequestHandler } from 'express';
import { taxService } from '../services/taxServices';
import { SaleEvent, TaxPaymentEvent } from '../models/transaction';

/**
 * @function ingestTransaction
 * @description Handles the ingestion of sales and tax payment events.
 *
 * @param {Request} req - The HTTP request object, containing the event data in the body.
 * @param {Response} res - The HTTP response object used to send responses back to the client.
 */
export const ingestTransaction: RequestHandler = (req: Request, res: Response): void => {
    const event: SaleEvent | TaxPaymentEvent = req.body;

    // Validate event payload
    if (!event || !event.eventType || !event.date) {
        res.status(400).json({ error: 'Invalid event payload' });
        return;
    }

    try {
        // Pass the event to the tax service for processing
        taxService.ingestTransaction(event);

        // Send a 202 Accepted response to indicate successful ingestion
        res.sendStatus(202);
    } catch (error: unknown) {
        console.error('Error ingesting transaction:', (error as Error).message || error);

        // Send a 500 Internal Server Error response with details about the error if ingestion fails
        res.status(500).json({ error: 'Failed to ingest transaction', details: (error as Error).message || 'Unknown error' });
    }
};
