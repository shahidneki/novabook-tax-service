"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesService = void 0;
/**
 * A service for managing sales events.
 *
 * @description This service allows ingestion, retrieval, and calculations of sales events, providing functionality to manage the sales data effectively.
 *
 * @class SalesService
 */
class SalesService {
    constructor() {
        this.sales = [];
    }
    /**
     * Ingests a new sale event.
     *
     * @method ingestSale
     * @description Adds a new sale event to the internal sales list.
     * @param {SaleEvent} event - The sale event to ingest.
     * @throws {Error} If the event is invalid.
     */
    ingestSale(event) {
        if (!event) {
            throw new Error("Invalid Sale Event");
        }
        this.sales.push(event);
    }
    /**
     * Finds all sales that occurred on or before the given date.
     *
     * @method findSales
     * @description Filters sales events based on the provided date.
     * @param {Date} date - The date to filter sales by.
     * @returns {SaleEvent[]} An array of sales events.
     */
    findSales(date) {
        return this.sales.filter(sale => new Date(sale.date) <= date);
    }
    /**
     * Creates a new sale event and adds it to the sales list.
     *
     * @method createNewSale
     * @description Constructs and ingests a new sale event based on provided parameters.
     * @param {string} invoiceId - The invoice ID for the sale.
     * @param {string} itemId - The item ID of the sold item.
     * @param {number} cost - The cost of the item.
     * @param {number} taxRate - The tax rate applied to the sale.
     * @param {string} date - The date of the sale in ISO 8601 format.
     * @throws {Error} If any required field is missing or invalid.
     */
    createNewSale(invoiceId, itemId, cost, taxRate, date) {
        if (!invoiceId || !itemId || cost <= 0 || taxRate < 0 || !date) {
            throw new Error("Invalid parameters for creating a new sale.");
        }
        const newSale = {
            eventType: 'SALES',
            date,
            invoiceId,
            items: [{ itemId, cost, taxRate }]
        };
        this.sales.push(newSale);
    }
    /**
     * Finds a sale by its invoice ID and the date.
     *
     * @method findSaleByIdAndDate
     * @description Retrieves a sale event that matches the given invoice ID and date.
     * @param {string} invoiceId - The invoice ID of the sale to find.
     * @param {Date} date - The date to filter sales by.
     * @returns {SaleEvent | undefined} The sale event if found, otherwise undefined.
     */
    findSaleByIdAndDate(invoiceId, date) {
        return this.sales.find(sale => sale.invoiceId === invoiceId && new Date(sale.date) <= date);
    }
    /**
     * Calculates the total sales tax for sales up to a given date.
     *
     * @method calculateTotalSalesTax
     * @description Computes the total tax from sales events prior to the specified date.
     * @param {string} date - The date to calculate the total sales tax by.
     * @returns {number} The total sales tax in pennies.
     */
    calculateTotalSalesTax(date) {
        const sales = this.findSales(new Date(date));
        const totalTax = sales.flatMap(sale => sale.items.map(item => Math.round(item.cost * item.taxRate))).reduce((sum, tax) => sum + tax, 0);
        return totalTax; // Returns total tax in pennies
    }
}
exports.salesService = new SalesService();
