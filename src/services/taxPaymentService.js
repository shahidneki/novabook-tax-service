"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxPaymentService = void 0;
/**
 * A service for managing tax payment events.
 *
 * @description This service allows for the ingestion, retrieval, and calculations of tax payments, providing functionality to manage tax payment data effectively.
 *
 * @class TaxPaymentService
 */
class TaxPaymentService {
    constructor() {
        this.taxPayments = [];
    }
    /**
     * Ingests a new tax payment event into the system.
     *
     * @method ingestTaxPayment
     * @description Adds a tax payment event to the list of tax payments.
     * @param {TaxPaymentEvent} event - The tax payment event to ingest.
     */
    ingestTaxPayment(event) {
        this.taxPayments.push(event);
    }
    /**
     * Finds all tax payments that occurred on or before the given date.
     *
     * @method findTaxPayments
     * @description Filters tax payments based on the specified date.
     * @param {Date} date - The date to filter tax payments by.
     * @returns {TaxPaymentEvent[]} An array of tax payment events.
     */
    findTaxPayments(date) {
        // Filter tax payments that occurred on or before the specified date
        return this.taxPayments.filter(payment => new Date(payment.date) <= date);
    }
    /**
     * Calculates the total amount of tax payments made up to the specified date.
     *
     * @method calculateTotalTaxPayments
     * @description Sums all tax payments made up to the provided date.
     * @param {string} date - The date to calculate the total tax payments by, in ISO 8601 format.
     * @returns {number} The total tax payments in pennies.
     */
    calculateTotalTaxPayments(date) {
        const payments = this.findTaxPayments(new Date(date));
        return payments.reduce((sum, payment) => sum + payment.amount, 0); // Assumes amounts are in pennies
    }
}
exports.taxPaymentService = new TaxPaymentService();
