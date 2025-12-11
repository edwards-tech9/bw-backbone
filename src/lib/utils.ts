/**
 * @fileoverview Utility functions for the BW Backbone application.
 *
 * This module provides common utility functions used throughout the application,
 * including CSS class merging, currency/date formatting, document number generation,
 * and time tracking calculations.
 *
 * @module lib/utils
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges CSS class names with Tailwind CSS conflict resolution.
 *
 * This utility combines the functionality of `clsx` for conditional class joining
 * with `tailwind-merge` for intelligent Tailwind CSS class conflict resolution.
 * It's particularly useful when you need to merge default component classes with
 * override classes passed as props.
 *
 * @param inputs - Any number of class values that can be strings, objects, or arrays.
 *                 Objects keys are used as class names if the value is truthy.
 *                 Arrays are recursively flattened.
 * @returns A single string of merged class names with Tailwind conflicts resolved.
 *
 * @example
 * // Basic usage with strings
 * cn('px-4', 'py-2', 'bg-blue-500')
 * // Returns: "px-4 py-2 bg-blue-500"
 *
 * @example
 * // Conditional classes with objects
 * cn('base-class', { 'active': isActive, 'disabled': isDisabled })
 *
 * @example
 * // Tailwind conflict resolution (later value wins)
 * cn('px-4 py-2', 'px-6')
 * // Returns: "py-2 px-6" (px-4 is replaced by px-6)
 *
 * @example
 * // Common use case: merging component defaults with prop overrides
 * cn('text-sm font-medium text-gray-900', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as US currency (USD).
 *
 * Uses the Intl.NumberFormat API to format numbers with proper currency
 * symbols, thousands separators, and decimal places according to US locale
 * conventions.
 *
 * @param amount - The numeric amount to format. Can be positive, negative, or zero.
 * @returns A formatted currency string including the dollar sign and proper formatting.
 *
 * @example
 * formatCurrency(1234.56)
 * // Returns: "$1,234.56"
 *
 * @example
 * formatCurrency(1000)
 * // Returns: "$1,000.00"
 *
 * @example
 * formatCurrency(-500.5)
 * // Returns: "-$500.50"
 *
 * @example
 * formatCurrency(0)
 * // Returns: "$0.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Formats a date as a human-readable short date string.
 *
 * Converts a date value to a localized US date string in the format
 * "MMM D, YYYY" (e.g., "Jan 5, 2024"). This format is suitable for
 * displaying dates in tables, lists, and detail views.
 *
 * @param date - The date to format. Can be a Date object or an ISO 8601
 *               date string (e.g., "2024-01-15" or "2024-01-15T10:30:00Z").
 * @returns A formatted date string in "MMM D, YYYY" format.
 *
 * @example
 * formatDate(new Date('2024-01-15'))
 * // Returns: "Jan 15, 2024"
 *
 * @example
 * formatDate('2024-12-25T00:00:00Z')
 * // Returns: "Dec 25, 2024"
 *
 * @example
 * // Usage with database timestamps
 * formatDate(job.created_at)
 * // Returns: "Nov 3, 2024"
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date as a human-readable date and time string.
 *
 * Converts a date value to a localized US date and time string in the format
 * "MMM D, YYYY, H:MM AM/PM" (e.g., "Jan 5, 2024, 2:30 PM"). This format is
 * suitable for displaying timestamps, activity logs, and time-sensitive data.
 *
 * @param date - The date to format. Can be a Date object or an ISO 8601
 *               date string with time component.
 * @returns A formatted date and time string in "MMM D, YYYY, H:MM AM/PM" format.
 *
 * @example
 * formatDateTime(new Date('2024-01-15T14:30:00'))
 * // Returns: "Jan 15, 2024, 2:30 PM"
 *
 * @example
 * formatDateTime('2024-12-25T09:15:00Z')
 * // Returns: "Dec 25, 2024, 9:15 AM" (adjusted for local timezone)
 *
 * @example
 * // Usage with time tracking data
 * formatDateTime(punch.clock_in)
 * // Returns: "Nov 3, 2024, 8:00 AM"
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Generates a unique job number for work orders.
 *
 * Creates a job number in the format "BWYYMM-NNNN" where:
 * - "BW" is the company prefix (BlueWave)
 * - "YY" is the 2-digit year
 * - "MM" is the 2-digit month (01-12)
 * - "NNNN" is a random 4-digit number (0000-9999)
 *
 * The format allows for up to 10,000 unique job numbers per month and
 * provides natural chronological sorting when grouped by prefix.
 *
 * @returns A unique job number string in "BWYYMM-NNNN" format.
 *
 * @example
 * generateJobNumber()
 * // Returns: "BW2412-3847" (for December 2024)
 *
 * @example
 * // Usage when creating a new job
 * const newJob = {
 *   job_number: generateJobNumber(),
 *   customer_id: selectedCustomer.id,
 *   // ...other job details
 * };
 *
 * @note This function uses Math.random() for the random component.
 *       For guaranteed uniqueness in high-volume scenarios, consider
 *       validating against existing job numbers in the database.
 */
export function generateJobNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `BW${year}${month}-${random}`;
}

/**
 * Generates a unique invoice number for billing.
 *
 * Creates an invoice number in the format "INVYYMM-NNNN" where:
 * - "INV" is the invoice prefix
 * - "YY" is the 2-digit year
 * - "MM" is the 2-digit month (01-12)
 * - "NNNN" is a random 4-digit number (0000-9999)
 *
 * The format allows for up to 10,000 unique invoices per month and
 * provides natural chronological sorting when grouped by prefix.
 *
 * @returns A unique invoice number string in "INVYYMM-NNNN" format.
 *
 * @example
 * generateInvoiceNumber()
 * // Returns: "INV2412-5291" (for December 2024)
 *
 * @example
 * // Usage when creating an invoice
 * const newInvoice = {
 *   invoice_number: generateInvoiceNumber(),
 *   job_id: job.id,
 *   amount: calculateTotal(lineItems),
 *   // ...other invoice details
 * };
 *
 * @note This function uses Math.random() for the random component.
 *       For guaranteed uniqueness, validate against existing invoice
 *       numbers in the database before saving.
 */
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `INV${year}${month}-${random}`;
}

/**
 * Generates a unique quote number for estimates.
 *
 * Creates a quote number in the format "QTYYMM-NNNN" where:
 * - "QT" is the quote prefix
 * - "YY" is the 2-digit year
 * - "MM" is the 2-digit month (01-12)
 * - "NNNN" is a random 4-digit number (0000-9999)
 *
 * The format allows for up to 10,000 unique quotes per month and
 * provides natural chronological sorting when grouped by prefix.
 *
 * @returns A unique quote number string in "QTYYMM-NNNN" format.
 *
 * @example
 * generateQuoteNumber()
 * // Returns: "QT2412-1028" (for December 2024)
 *
 * @example
 * // Usage when creating a quote
 * const newQuote = {
 *   quote_number: generateQuoteNumber(),
 *   customer_id: selectedCustomer.id,
 *   valid_until: addDays(new Date(), 30),
 *   // ...other quote details
 * };
 *
 * @note This function uses Math.random() for the random component.
 *       For guaranteed uniqueness, validate against existing quote
 *       numbers in the database before saving.
 */
export function generateQuoteNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `QT${year}${month}-${random}`;
}

/**
 * Calculates the number of hours between two timestamps (clock in/out punches).
 *
 * Computes the elapsed time between a clock-in and clock-out timestamp,
 * returning the result as decimal hours rounded to 2 decimal places.
 * This function is used for time tracking and payroll calculations.
 *
 * The rounding to 2 decimal places (e.g., 8.25 hours) provides sufficient
 * precision for payroll while avoiding floating-point representation issues.
 *
 * @param clockIn - The Date object representing when the employee clocked in.
 * @param clockOut - The Date object representing when the employee clocked out.
 *                   Must be later than clockIn for a positive result.
 * @returns The number of hours between the two timestamps, rounded to 2 decimal places.
 *
 * @example
 * // Calculate an 8-hour shift
 * const clockIn = new Date('2024-01-15T08:00:00');
 * const clockOut = new Date('2024-01-15T16:00:00');
 * calculateHoursFromPunches(clockIn, clockOut)
 * // Returns: 8.00
 *
 * @example
 * // Calculate partial hours
 * const clockIn = new Date('2024-01-15T08:00:00');
 * const clockOut = new Date('2024-01-15T12:30:00');
 * calculateHoursFromPunches(clockIn, clockOut)
 * // Returns: 4.50
 *
 * @example
 * // Calculate with minutes that don't divide evenly
 * const clockIn = new Date('2024-01-15T08:00:00');
 * const clockOut = new Date('2024-01-15T17:15:00');
 * calculateHoursFromPunches(clockIn, clockOut)
 * // Returns: 9.25
 *
 * @note If clockOut is earlier than clockIn, the result will be negative.
 *       The calling code should validate that clockOut > clockIn before calling.
 */
export function calculateHoursFromPunches(clockIn: Date, clockOut: Date): number {
  const diff = clockOut.getTime() - clockIn.getTime();
  return Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
}

/**
 * Determines if hours worked qualify as overtime.
 *
 * Checks whether the given hours trigger overtime pay based on standard
 * US overtime rules:
 * - **Daily overtime**: More than 8 hours worked in a single day
 * - **Weekly overtime**: More than 40 hours worked in a single week
 *
 * Returns true if EITHER condition is met, as both qualify for overtime pay.
 *
 * @param hours - The number of hours worked in a single day/shift.
 * @param weeklyHours - The total hours worked so far in the current week
 *                      (including the current day's hours).
 * @returns `true` if the hours qualify as overtime (daily > 8 OR weekly > 40),
 *          `false` otherwise.
 *
 * @example
 * // Normal day, normal week - no overtime
 * isOvertime(8, 32)
 * // Returns: false
 *
 * @example
 * // Long day (daily overtime)
 * isOvertime(10, 30)
 * // Returns: true (hours > 8)
 *
 * @example
 * // Normal day but weekly overtime
 * isOvertime(8, 45)
 * // Returns: true (weeklyHours > 40)
 *
 * @example
 * // Both conditions triggered
 * isOvertime(12, 52)
 * // Returns: true (both conditions met)
 *
 * @example
 * // Usage in payroll calculations
 * const isOT = isOvertime(dailyHours, weeklyHoursTotal);
 * const rate = isOT ? employee.hourlyRate * 1.5 : employee.hourlyRate;
 *
 * @note This implements standard US FLSA overtime rules. Some states
 *       (like California) have additional overtime rules that may need
 *       separate handling.
 */
export function isOvertime(hours: number, weeklyHours: number): boolean {
  return weeklyHours > 40 || hours > 8;
}
