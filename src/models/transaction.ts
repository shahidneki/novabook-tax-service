/**
 * Represents a sales event.
 * 
 * @interface SaleEvent
 * @property {string} eventType - The type of event, which is always 'SALES'.
 * @property {string} date - The date of the sale in ISO 8601 format.
 * @property {string} invoiceId - The unique identifier for the sale invoice.
 * @property {Array<{ itemId: string; cost: number; taxRate: number }>} items - An array of items sold in the transaction,
 *          where each item has an ID, cost, and tax rate.
 */
export interface SaleEvent {
  eventType: 'SALES';
  date: string;
  invoiceId: string;
  items: Array<{ itemId: string; cost: number; taxRate: number }>;
}

/**
 * Represents a tax payment event.
 * 
 * @interface TaxPaymentEvent
 * @property {string} eventType - The type of event, which is always 'TAX_PAYMENT'.
 * @property {string} date - The date of the tax payment in ISO 8601 format.
 * @property {number} amount - The amount of tax paid, typically in pennies.
 */
export interface TaxPaymentEvent {
  eventType: 'TAX_PAYMENT';
  date: string;
  amount: number;
}

/**
 * Represents an amendment to a sale.
 * 
 * @interface Amendment
 * @property {string} date - The date of the amendment in ISO 8601 format.
 * @property {string} invoiceId - The unique identifier for the original sale invoice.
 * @property {string} itemId - The ID of the item being amended.
 * @property {number} cost - The updated cost of the item.
 * @property {number} taxRate - The updated tax rate for the item.
 */
export interface Amendment {
  date: string;
  invoiceId: string;
  itemId: string;
  cost: number;
  taxRate: number;
}
