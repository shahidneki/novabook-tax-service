import { Request, Response, RequestHandler } from 'express';
import { taxService } from '../services/taxServices';
import { SaleEvent, TaxPaymentEvent, Amendment } from '../models/transaction'; // Import relevant types

export const ingestTransaction: RequestHandler = (req: Request, res: Response): void => {
    const event: SaleEvent | TaxPaymentEvent = req.body;

    // Validate event payload
    if (!event || !event.eventType || !event.date) {
        res.status(400).json({ error: 'Invalid event payload' });
        return;
    }

    try {
        taxService.ingestTransaction(event);
        res.sendStatus(202);
    } catch (error: unknown) {
        console.error('Error ingesting transaction:', (error as Error).message || error);
        res.status(500).json({ error: 'Failed to ingest transaction', details: (error as Error).message || 'Unknown error' });
    }
};

export const queryTaxPosition: RequestHandler = (req: Request, res: Response): void => {
    const { date } = req.query;

    // Validate date query parameter
    if (typeof date !== 'string' || !date) {
        res.status(400).json({ error: 'Date is required and must be a valid string' });
        return;
    }

    if (isNaN(Date.parse(date))) {
        res.status(400).json({ error: 'Invalid date format. Please use ISO 8601 format.' });
        return;
    }

    try {
        const taxPosition = taxService.queryTaxPosition(date);
        res.status(200).json({ date, taxPosition });
    } catch (error: unknown) {
        console.error('Error querying tax position:', (error as Error).message || error);
        res.status(500).json({ error: 'Failed to calculate tax position', details: (error as Error).message || 'Unknown error' });
    }
};

export const amendSale: RequestHandler = (req: Request, res: Response): void => {
    const amendment: Amendment = req.body;

    // Validate amendment payload
    if (!amendment || !amendment.date || !amendment.invoiceId || !amendment.itemId) {
        res.status(400).json({ error: 'Invalid amendment payload' });
        return;
    }

    try {
        taxService.amendSale(amendment);
        res.sendStatus(202);
    } catch (error: unknown) {
        console.error('Error amending sale:', (error as Error).message || error);
        res.status(500).json({ error: 'Failed to amend sale', details: (error as Error).message || 'Unknown error' });
    }
};
