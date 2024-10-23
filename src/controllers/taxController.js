"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amendSale = exports.queryTaxPosition = exports.ingestTransaction = void 0;
const taxServices_1 = require("../services/taxServices");
const ingestTransaction = (req, res) => {
    const event = req.body;
    // Validate event payload
    if (!event || !event.eventType || !event.date) {
        res.status(400).json({ error: 'Invalid event payload' });
        return;
    }
    try {
        taxServices_1.taxService.ingestTransaction(event);
        res.sendStatus(202);
    }
    catch (error) {
        console.error('Error ingesting transaction:', error.message || error);
        res.status(500).json({ error: 'Failed to ingest transaction', details: error.message || 'Unknown error' });
    }
};
exports.ingestTransaction = ingestTransaction;
const queryTaxPosition = (req, res) => {
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
        const taxPosition = taxServices_1.taxService.queryTaxPosition(date);
        res.status(200).json({ date, taxPosition });
    }
    catch (error) {
        console.error('Error querying tax position:', error.message || error);
        res.status(500).json({ error: 'Failed to calculate tax position', details: error.message || 'Unknown error' });
    }
};
exports.queryTaxPosition = queryTaxPosition;
const amendSale = (req, res) => {
    const amendment = req.body;
    // Validate amendment payload
    if (!amendment || !amendment.date || !amendment.invoiceId || !amendment.itemId) {
        res.status(400).json({ error: 'Invalid amendment payload' });
        return;
    }
    try {
        taxServices_1.taxService.amendSale(amendment);
        res.sendStatus(202);
    }
    catch (error) {
        console.error('Error amending sale:', error.message || error);
        res.status(500).json({ error: 'Failed to amend sale', details: error.message || 'Unknown error' });
    }
};
exports.amendSale = amendSale;
