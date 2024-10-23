"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taxServices_1 = require("../services/taxServices");
const salesService_1 = require("../services/salesService");
const taxPaymentService_1 = require("../services/taxPaymentService");
/**
 * Resets the state of the sales and tax payment services before each test.
 *
 * @function resetServicesState
 * @returns {void}
 */
const resetServicesState = () => {
    salesService_1.salesService.sales = [];
    taxPaymentService_1.taxPaymentService.taxPayments = [];
};
// Run before each test to ensure a clean state
beforeEach(() => {
    resetServicesState();
});
/**
 * Test suite for ingesting transactions (sales and tax payments).
 */
describe('Ingesting Transactions', () => {
    /**
     * Test to ensure a sales event is ingested correctly.
     */
    test('should ingest a sales event correctly', () => {
        const saleEvent = {
            eventType: 'SALES',
            date: '2024-02-22T17:29:39Z',
            invoiceId: 'invoice1',
            items: [{
                    itemId: 'item1',
                    cost: 1099,
                    taxRate: 0.2,
                }],
        };
        // Ingest the sales event
        taxServices_1.taxService.ingestTransaction(saleEvent);
        // Verify that the sales event has been recorded
        expect(salesService_1.salesService.sales.length).toBe(1);
        expect(salesService_1.salesService.sales[0]).toEqual(saleEvent);
    });
    /**
     * Test to ensure a tax payment event is ingested correctly.
     */
    test('should ingest a tax payment event correctly', () => {
        const taxPaymentEvent = {
            eventType: 'TAX_PAYMENT',
            date: '2024-02-22T17:29:39Z',
            amount: 500,
        };
        // Ingest the tax payment event
        taxServices_1.taxService.ingestTransaction(taxPaymentEvent);
        // Verify that the tax payment event has been recorded
        expect(taxPaymentService_1.taxPaymentService.taxPayments.length).toBe(1);
        expect(taxPaymentService_1.taxPaymentService.taxPayments[0]).toEqual(taxPaymentEvent);
    });
    /**
     * Test to ensure an error is thrown for an invalid tax payment event.
     */
    test('should throw an error for invalid tax payment event', () => {
        const invalidTaxPaymentEvent = {
            eventType: 'TAX_PAYMENT',
            date: '2024-02-22T17:29:39Z',
            // Missing 'amount'
        };
        // Expect an error to be thrown when ingesting an invalid tax payment event
        expect(() => taxServices_1.taxService.ingestTransaction(invalidTaxPaymentEvent)).toThrow("Invalid Tax Payment Event");
    });
    /**
     * Test to ensure an error is thrown for an invalid sale event.
     */
    test('should throw an error for invalid sale event', () => {
        const invalidSaleEvent = {
            eventType: 'SALES',
            date: '2024-02-22T17:29:39Z',
            // Missing 'invoiceId' and 'items'
        };
        // Expect an error to be thrown when ingesting an invalid sale event
        expect(() => taxServices_1.taxService.ingestTransaction(invalidSaleEvent)).toThrow("Invalid Sale Event");
    });
});
