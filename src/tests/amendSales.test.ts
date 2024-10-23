import { taxService } from '../services/taxServices';
import { salesService } from '../services/salesService';
import { SaleEvent, Amendment } from '../models/transaction';

/**
 * Resets the state of the sales service before each test.
 * 
 * @function resetServicesState
 * @returns {void}
 */
const resetServicesState = (): void => {
  (salesService as any).sales = [];
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
    const saleEvent: SaleEvent = {
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
    taxService.ingestTransaction(saleEvent);

    const amendment: Amendment = {
      date: '2024-02-23T17:29:39Z',
      invoiceId: 'invoice1',
      itemId: 'item1',
      cost: 999,
      taxRate: 0.15,
    };

    // Amend the existing sale
    taxService.amendSale(amendment);

    // Retrieve the updated sale using the service method
    const updatedSale = salesService.findSaleByIdAndDate('invoice1', new Date('2024-02-23T17:29:39Z'));

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
    const amendment: Amendment = {
      date: '2024-02-22T17:29:39Z',
      invoiceId: 'invoice2',
      itemId: 'item1',
      cost: 999,
      taxRate: 0.15,
    };

    // Attempt to amend a non-existing sale
    taxService.amendSale(amendment);

    // Verify that a new sale was created
    expect((salesService as any).sales.length).toBe(1); // Expect one sale to be created
    expect((salesService as any).sales[0]).toEqual({
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
