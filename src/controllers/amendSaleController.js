"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amendSale = void 0;
const taxServices_1 = require("../services/taxServices");
/**
 * @function amendSale
 * @description Handles the amendment of a sale event.
 *
 * @param {Request} req - The HTTP request object, containing the amendment data in the body.
 * @param {Response} res - The HTTP response object used to send responses back to the client.
 */
const amendSale = (req, res) => {
    const amendment = req.body;
    // Validate amendment payload
    if (!amendment || !amendment.date || !amendment.invoiceId || !amendment.itemId) {
        res.status(400).json({ error: 'Invalid amendment payload' });
        return;
    }
    try {
        // Pass the amendment to the tax service for processing
        taxServices_1.taxService.amendSale(amendment);
        // Send a 202 Accepted response to indicate successful amendment
        res.sendStatus(202);
    }
    catch (error) {
        console.error('Error amending sale:', error.message || error);
        // Send a 500 Internal Server Error response with details about the error if amendment fails
        res.status(500).json({ error: 'Failed to amend sale', details: error.message || 'Unknown error' });
    }
};
exports.amendSale = amendSale;
