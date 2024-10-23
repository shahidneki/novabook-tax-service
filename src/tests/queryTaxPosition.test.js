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
 * Test suite for querying the tax position.
 */
describe('Querying Tax Position', () => {
    /**
     * Test to ensure that the tax position is calculated correctly.
     */
    test('should calculate tax position correctly', () => {
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
        const taxPaymentEvent = {
            eventType: 'TAX_PAYMENT',
            date: '2024-02-23T17:29:39Z',
            amount: 20000, // £200 in pennies
        };
        // Ingest the sale and tax payment events
        taxServices_1.taxService.ingestTransaction(saleEvent);
        taxServices_1.taxService.ingestTransaction(taxPaymentEvent);
        // Query the tax position for the specified date
        const taxPosition = taxServices_1.taxService.queryTaxPosition('2024-02-24T17:29:39Z');
        expect(taxPosition).toBe(-19780); // Expected tax position: £-197.80
    });
    /**
     * Test to ensure that the tax position returns 0 when no events exist.
     */
    test('should return 0 tax position when no events exist', () => {
        const taxPosition = taxServices_1.taxService.queryTaxPosition('2024-02-24T17:29:39Z');
        expect(taxPosition).toBe(0);
    });
    /**
     * Test to ensure that tax payments are found correctly.
     */
    test('should find tax payments correctly', () => {
        const taxPaymentEvent1 = {
            eventType: 'TAX_PAYMENT',
            date: '2024-02-22T17:29:39Z',
            amount: 10000, // £100 in pennies
        };
        const taxPaymentEvent2 = {
            eventType: 'TAX_PAYMENT',
            date: '2024-02-23T17:29:39Z',
            amount: 20000, // £200 in pennies
        };
        // Ingest the tax payment events
        taxServices_1.taxService.ingestTransaction(taxPaymentEvent1);
        taxServices_1.taxService.ingestTransaction(taxPaymentEvent2);
        // Find tax payments before the second date
        const paymentsBeforeDate = taxPaymentService_1.taxPaymentService.findTaxPayments(new Date('2024-02-23T00:00:00Z'));
        expect(paymentsBeforeDate.length).toBe(1);
        expect(paymentsBeforeDate[0]).toEqual(taxPaymentEvent1);
        // Find tax payments on the second date
        const paymentsOnDate = taxPaymentService_1.taxPaymentService.findTaxPayments(new Date('2024-02-23T17:29:39Z'));
        expect(paymentsOnDate.length).toBe(2);
        // Find tax payments after the second date
        const paymentsAfterDate = taxPaymentService_1.taxPaymentService.findTaxPayments(new Date('2024-02-24T00:00:00Z'));
        expect(paymentsAfterDate.length).toBe(2);
    });
});
