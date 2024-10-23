"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestTransaction = void 0;
const taxServices_1 = require("../services/taxServices");
/**
 * @function ingestTransaction
 * @description Handles the ingestion of sales and tax payment events.
 *
 * @param {Request} req - The HTTP request object, containing the event data in the body.
 * @param {Response} res - The HTTP response object used to send responses back to the client.
 */
const ingestTransaction = (req, res) => {
    const event = req.body;
    // Validate event payload
    if (!event || !event.eventType || !event.date) {
        res.status(400).json({ error: 'Invalid event payload' });
        return;
    }
    try {
        // Pass the event to the tax service for processing
        taxServices_1.taxService.ingestTransaction(event);
        // Send a 202 Accepted response to indicate successful ingestion
        res.sendStatus(202);
    }
    catch (error) {
        console.error('Error ingesting transaction:', error.message || error);
        // Send a 500 Internal Server Error response with details about the error if ingestion fails
        res.status(500).json({ error: 'Failed to ingest transaction', details: error.message || 'Unknown error' });
    }
};
exports.ingestTransaction = ingestTransaction;
