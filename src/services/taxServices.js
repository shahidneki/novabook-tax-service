"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxService = void 0;
const salesService_1 = require("./salesService");
const taxPaymentService_1 = require("./taxPaymentService");
const amendmentService_1 = require("./amendmentService");
/**
 * A service for managing Tax Services.
 *
 * @class TaxService
 *
 * @description Service for handling tax-related transactions, including sales events and tax payments.
 */
class TaxService {
    /**
     * @method ingestTransaction
     * @description Ingests a sale or tax payment event into the system.
     *
     * @param {SaleEvent | TaxPaymentEvent} event - The event to be ingested.
     * @throws {Error} If the event is invalid or of an unknown type.
     */
    ingestTransaction(event) {
        if (this.isSaleEvent(event)) {
            if (!event.invoiceId || !event.items || event.items.length === 0) {
                throw new Error("Invalid Sale Event");
            }
            salesService_1.salesService.ingestSale(event);
        }
        else if (this.isTaxPaymentEvent(event)) {
            if (event.amount == null) {
                throw new Error("Invalid Tax Payment Event");
            }
            taxPaymentService_1.taxPaymentService.ingestTaxPayment(event);
        }
        else {
            throw new Error("Unknown Event Type");
        }
    }
    /**
     * @method queryTaxPosition
     * @description Calculates the tax position based on ingested events up to a given date.
     *
     * @param {string} date - The date to query the tax position for, in ISO 8601 format.
     * @returns {number} The calculated tax position.
     */
    queryTaxPosition(date) {
        const totalSalesTax = salesService_1.salesService.calculateTotalSalesTax(date);
        const totalTaxPayments = taxPaymentService_1.taxPaymentService.calculateTotalTaxPayments(date);
        return totalSalesTax - totalTaxPayments;
    }
    /**
     * @method isSaleEvent
     * @description Checks if the provided event is a sale event.
     *
     * @param {any} event - The event to check.
     * @returns {event is SaleEvent} True if the event is a SaleEvent, otherwise false.
     */
    isSaleEvent(event) {
        return event.eventType === 'SALES';
    }
    /**
     * @method isTaxPaymentEvent
     * @description Checks if the provided event is a tax payment event.
     *
     * @param {any} event - The event to check.
     * @returns {event is TaxPaymentEvent} True if the event is a TaxPaymentEvent, otherwise false.
     */
    isTaxPaymentEvent(event) {
        return event.eventType === 'TAX_PAYMENT';
    }
    /**
     * @method amendSale
     * @description Amends an existing sale based on the provided amendment data.
     *
     * @param {Amendment} amendment - The amendment data to apply to the sale.
     */
    amendSale(amendment) {
        amendmentService_1.amendmentService.amendSale(amendment);
    }
}
exports.taxService = new TaxService();
