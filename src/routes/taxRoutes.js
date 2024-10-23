"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ingestTransactionController_1 = require("../controllers/ingestTransactionController");
const queryTaxPositionController_1 = require("../controllers/queryTaxPositionController");
const amendSaleController_1 = require("../controllers/amendSaleController");
const router = (0, express_1.Router)();
/**
 * @module TaxServiceRoutes
 * @description Routes for handling tax service operations.
 */
/**
 * @route POST /transactions
 * @description Ingest a sales or tax payment event.
 */
router.post('/transactions', ingestTransactionController_1.ingestTransaction);
/**
 * @route GET /tax-position
 * @description Query the tax position based on a specified date and time in ISO 8601 format.
 */
router.get('/tax-position', queryTaxPositionController_1.queryTaxPosition);
/**
 * @route PATCH /sale
 * @description Amend an existing sale record at a specific point in time.
 */
router.patch('/sale', amendSaleController_1.amendSale);
exports.default = router;
