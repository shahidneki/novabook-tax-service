import { taxService } from '../services/taxServices';
import { salesService } from '../services/salesService';
import { taxPaymentService } from '../services/taxPaymentService';
import { SaleEvent, TaxPaymentEvent } from '../models/transaction';

/**
 * Resets the state of the sales and tax payment services before each test.
 * 
 * @function resetServicesState
 * @returns {void}
 */
const resetServicesState = (): void => {
  (salesService as any).sales = [];
  (taxPaymentService as any).taxPayments = [];
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

    // Ingest the sales event
    taxService.ingestTransaction(saleEvent);

    // Verify that the sales event has been recorded
    expect((salesService as any).sales.length).toBe(1);
    expect((salesService as any).sales[0]).toEqual(saleEvent);
  });

  /**
   * Test to ensure a tax payment event is ingested correctly.
   */
  test('should ingest a tax payment event correctly', () => {
    const taxPaymentEvent: TaxPaymentEvent = {
      eventType: 'TAX_PAYMENT',
      date: '2024-02-22T17:29:39Z',
      amount: 500,
    };

    // Ingest the tax payment event
    taxService.ingestTransaction(taxPaymentEvent);

    // Verify that the tax payment event has been recorded
    expect((taxPaymentService as any).taxPayments.length).toBe(1);
    expect((taxPaymentService as any).taxPayments[0]).toEqual(taxPaymentEvent);
  });

  /**
   * Test to ensure an error is thrown for an invalid tax payment event.
   */
  test('should throw an error for invalid tax payment event', () => {
    const invalidTaxPaymentEvent: Partial<TaxPaymentEvent> = {
      eventType: 'TAX_PAYMENT',
      date: '2024-02-22T17:29:39Z',
      // Missing 'amount'
    };

    // Expect an error to be thrown when ingesting an invalid tax payment event
    expect(() => taxService.ingestTransaction(invalidTaxPaymentEvent as TaxPaymentEvent)).toThrow("Invalid Tax Payment Event");
  });

  /**
   * Test to ensure an error is thrown for an invalid sale event.
   */
  test('should throw an error for invalid sale event', () => {
    const invalidSaleEvent: Partial<SaleEvent> = {
      eventType: 'SALES',
      date: '2024-02-22T17:29:39Z',
      // Missing 'invoiceId' and 'items'
    };

    // Expect an error to be thrown when ingesting an invalid sale event
    expect(() => taxService.ingestTransaction(invalidSaleEvent as SaleEvent)).toThrow("Invalid Sale Event");
  });
});
