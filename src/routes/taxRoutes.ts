import { Router } from 'express';
import { ingestTransaction } from '../controllers/ingestTransactionController';
import { queryTaxPosition } from '../controllers/queryTaxPositionController';
import { amendSale } from '../controllers/amendSaleController';

const router = Router();

/**
 * @module TaxServiceRoutes
 * @description Routes for handling tax service operations.
 */

/**
 * @route POST /transactions
 * @description Ingest a sales or tax payment event.
 */
router.post('/transactions', ingestTransaction);

/**
 * @route GET /tax-position
 * @description Query the tax position based on a specified date and time in ISO 8601 format.
 */
router.get('/tax-position', queryTaxPosition);

/**
 * @route PATCH /sale
 * @description Amend an existing sale record at a specific point in time.
 */
router.patch('/sale', amendSale);

export default router;
