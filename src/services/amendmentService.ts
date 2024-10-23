import { salesService } from './salesService';
import { SaleEvent, Amendment } from '../models/transaction';

/**
 * A service for handling amendments to sales events.
 * 
 * @description This service allows for the modification of existing sales and the creation of new sales based on amendment requests.
 * 
 * @class AmendmentService
 */
class AmendmentService {
    /**
     * Amends an existing sale or creates a new one based on the provided amendment data.
     * 
     * @method amendSale
     * @description Updates an existing sale if found; otherwise, creates a new sale.
     * @param {Amendment} amendment - The amendment data containing details of the sale to amend.
     * @throws {Error} If the amendment data is invalid.
     */
    public amendSale(amendment: Amendment): void {
        const { invoiceId, date, itemId, cost, taxRate } = amendment;

        if (!invoiceId || !date || !itemId || cost == null || taxRate == null) {
            throw new Error("Invalid amendment data.");
        }
        
        const sale = salesService.findSaleByIdAndDate(invoiceId, new Date(date));
        
        if (sale) {
            const itemIndex = sale.items.findIndex(item => item.itemId === itemId);
            if (itemIndex !== -1) {
                // Update existing item
                sale.items[itemIndex] = { ...sale.items[itemIndex], cost, taxRate };
            } else {
                // Add new item to existing sale
                sale.items.push({ itemId, cost, taxRate });
            }
        } else {
            const newSale: SaleEvent = {
                eventType: 'SALES',
                date: new Date(date).toISOString(),
                invoiceId,
                items: [{ itemId, cost, taxRate }]
            };
            salesService.ingestSale(newSale);
        }
    }
}

export const amendmentService = new AmendmentService();
