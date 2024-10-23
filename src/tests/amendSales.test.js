"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taxServices_1 = require("../services/taxServices");
const salesService_1 = require("../services/salesService");
/**
 * Resets the state of the sales service before each test.
 *
 * @function resetServicesState
 * @returns {void}
 */
const resetServicesState = () => {
    salesService_1.salesService.sales = [];
};
// Run before each test to ensure a clean state
beforeEach(() => {
    resetServicesState();
});
/**
 * Test suite for amending sales.
 */
describe('Amending Sales', () => {
    /**
     * Test to check if an existing sale item can be amended.
     */
    test('should amend an existing sale item', () => {
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
        // Ingest the initial sale event
        taxServices_1.taxService.ingestTransaction(saleEvent);
        const amendment = {
            date: '2024-02-23T17:29:39Z',
            invoiceId: 'invoice1',
            itemId: 'item1',
            cost: 999,
            taxRate: 0.15,
        };
        // Amend the existing sale
        taxServices_1.taxService.amendSale(amendment);
        // Retrieve the updated sale using the service method
        const updatedSale = salesService_1.salesService.findSaleByIdAndDate('invoice1', new Date('2024-02-23T17:29:39Z'));
        // Check if updatedSale is defined
        expect(updatedSale).toBeDefined(); // Ensure updatedSale is not undefined
        if (updatedSale) {
            // Validate the updated properties of the sale item
            expect(updatedSale.items[0]).toEqual({
                itemId: 'item1',
                cost: 999,
                taxRate: 0.15,
            });
        }
    });
    /**
     * Test to check if a new sale record is created when amendment refers to a non-existing sale.
     */
    test('should create a new sale record if amendment refers to a non-existing sale', () => {
        const amendment = {
            date: '2024-02-22T17:29:39Z',
            invoiceId: 'invoice2',
            itemId: 'item1',
            cost: 999,
            taxRate: 0.15,
        };
        // Attempt to amend a non-existing sale
        taxServices_1.taxService.amendSale(amendment);
        // Verify that a new sale was created
        expect(salesService_1.salesService.sales.length).toBe(1); // Expect one sale to be created
        expect(salesService_1.salesService.sales[0]).toEqual({
            eventType: 'SALES',
            date: '2024-02-22T17:29:39.000Z',
            invoiceId: 'invoice2',
            items: [{
                    itemId: 'item1',
                    cost: 999,
                    taxRate: 0.15,
                }],
        });
    });
});
