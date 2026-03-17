import { PaymentType } from "../../db/entities/Payment";
import type { RateHistory } from "../rates/primeRateScraper";
import { generateLoanPayments } from "../loans/loanPaymentsGenerator";

/** Helper: creates a RateHistory map with a single fixed rate starting on the given date */
const fixedRate = (startDate: string, rate: number): RateHistory =>
  new Map([[startDate, rate]]);

describe("generateLoanPayments", () => {
  const rate = 0.08; // 8%

  it("generates monthly interest-only payments and a final principal+interest payment", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-04-30",
      fixedRate("2024-01-01", rate),
    );

    expect(payments).toHaveLength(4);

    // First 3 are interest-only
    for (const p of payments.slice(0, -1)) {
      expect(p.paymentType).toBe(PaymentType.Interest);
      expect(p.principal).toBe(0);
      expect(p.remainingBalance).toBe(100_000);
    }

    // Last payment includes principal
    const last = payments[payments.length - 1];
    expect(last.paymentType).toBe(PaymentType.PrincipalAndInterest);
    expect(last.principal).toBe(100_000);
    expect(last.remainingBalance).toBe(0);
  });

  it("calculates interest using 30/360 method", () => {
    // 100,000 * 0.08 * (30/360) = 666.67
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-03-31",
      fixedRate("2024-01-01", rate),
    );

    expect(payments[0].interest).toBeCloseTo(666.67, 2);
    expect(payments[0].total).toBeCloseTo(666.67, 2);
  });

  it("handles a single-month loan (start and end in same month)", () => {
    const payments = generateLoanPayments(
      50_000,
      "2024-03-01",
      "2024-03-31",
      fixedRate("2024-03-01", rate),
    );

    expect(payments).toHaveLength(1);
    expect(payments[0].paymentType).toBe(PaymentType.PrincipalAndInterest);
    expect(payments[0].principal).toBe(50_000);
    expect(payments[0].remainingBalance).toBe(0);
  });

  it("merges final payment when end date falls on last day of a payment month", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-01-31",
      fixedRate("2024-01-01", rate),
    );

    expect(payments).toHaveLength(1);
    expect(payments[0].paymentType).toBe(PaymentType.PrincipalAndInterest);
    expect(payments[0].principal).toBe(100_000);
    expect(payments[0].total).toBe(100_000 + payments[0].interest);
  });

  it("sets correct payment dates on last day of each month", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-04-30",
      fixedRate("2024-01-01", rate),
    );

    expect(payments[0].paymentDate).toBe("2024-01-31");
    expect(payments[1].paymentDate).toBe("2024-02-29"); // 2024 is a leap year
    expect(payments[2].paymentDate).toBe("2024-03-31");
    expect(payments[3].paymentDate).toBe("2024-04-30");
  });

  it("final payment date matches the loan end date", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-06-15",
      fixedRate("2024-01-01", rate),
    );

    const last = payments[payments.length - 1];
    expect(last.paymentDate).toBe("2024-06-15");
    expect(last.paymentType).toBe(PaymentType.PrincipalAndInterest);
  });

  it("spans multiple years correctly", () => {
    const payments = generateLoanPayments(
      100_000,
      "2023-11-01",
      "2024-02-29",
      fixedRate("2023-11-01", rate),
    );

    // Nov, Dec, Jan, Feb = 4 months
    expect(payments).toHaveLength(4);
    expect(payments[0].paymentDate).toBe("2023-11-30");
    expect(payments[1].paymentDate).toBe("2023-12-31");
    expect(payments[2].paymentDate).toBe("2024-01-31");
    expect(payments[3].paymentDate).toBe("2024-02-29");
  });

  it("handles end date mid-month with separate final payment", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-03-15",
      fixedRate("2024-01-01", rate),
    );

    // Jan 31, Feb 29 interest-only + Mar 15 principal+interest
    expect(payments).toHaveLength(3);
    expect(payments[0].paymentType).toBe(PaymentType.Interest);
    expect(payments[1].paymentType).toBe(PaymentType.Interest);
    expect(payments[2].paymentType).toBe(PaymentType.PrincipalAndInterest);
    expect(payments[2].paymentDate).toBe("2024-03-15");
    expect(payments[2].principal).toBe(100_000);
  });

  it("all interest amounts are equal with a fixed rate", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-06-30",
      fixedRate("2024-01-01", rate),
    );

    const interestOnly = payments.filter(
      (p) => p.paymentType === PaymentType.Interest,
    );

    for (const p of interestOnly) {
      expect(p.interest).toBeCloseTo(666.67, 2);
    }
  });

  it("handles February in a non-leap year", () => {
    const payments = generateLoanPayments(
      100_000,
      "2023-02-01",
      "2023-02-28",
      fixedRate("2023-02-01", rate),
    );

    expect(payments).toHaveLength(1);
    expect(payments[0].paymentDate).toBe("2023-02-28");
    expect(payments[0].paymentType).toBe(PaymentType.PrincipalAndInterest);
  });

  it("total of all payments equals principal plus total interest", () => {
    const payments = generateLoanPayments(
      200_000,
      "2024-01-01",
      "2024-06-30",
      fixedRate("2024-01-01", rate),
    );

    const totalPaid = payments.reduce((sum, p) => sum + p.total, 0);
    const totalInterest = payments.reduce((sum, p) => sum + p.interest, 0);
    const totalPrincipal = payments.reduce((sum, p) => sum + p.principal, 0);

    expect(totalPrincipal).toBe(200_000);
    expect(totalPaid).toBeCloseTo(200_000 + totalInterest, 2);
  });

  it("remaining balance is constant for all interest-only payments", () => {
    const payments = generateLoanPayments(
      150_000,
      "2024-01-01",
      "2024-12-31",
      fixedRate("2024-01-01", rate),
    );

    const interestOnlyPayments = payments.filter(
      (p) => p.paymentType === PaymentType.Interest,
    );

    for (const p of interestOnlyPayments) {
      expect(p.remainingBalance).toBe(150_000);
      expect(p.principal).toBe(0);
    }
  });

  it("handles a small principal amount", () => {
    const payments = generateLoanPayments(
      1,
      "2024-01-01",
      "2024-03-31",
      fixedRate("2024-01-01", rate),
    );

    expect(payments).toHaveLength(3);
    for (const p of payments.slice(0, -1)) {
      expect(p.interest).toBeGreaterThanOrEqual(0);
    }
    expect(payments[payments.length - 1].principal).toBe(1);
  });

  it("handles a large principal amount", () => {
    const payments = generateLoanPayments(
      10_000_000,
      "2024-01-01",
      "2024-02-29",
      fixedRate("2024-01-01", rate),
    );

    // 10,000,000 * 0.08 * (30/360) = 66,666.67
    expect(payments[0].interest).toBeCloseTo(66_666.67, 2);
    expect(payments[1].principal).toBe(10_000_000);
  });

  it("every payment has all required fields defined", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-06-30",
      fixedRate("2024-01-01", rate),
    );

    for (const p of payments) {
      expect(p.paymentDate).toBeDefined();
      expect(p.paymentType).toBeDefined();
      expect(typeof p.principal).toBe("number");
      expect(typeof p.interest).toBe("number");
      expect(typeof p.total).toBe("number");
      expect(typeof p.remainingBalance).toBe("number");
    }
  });

  it("interest-only payment total equals its interest", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-06-30",
      fixedRate("2024-01-01", rate),
    );

    const interestOnly = payments.filter(
      (p) => p.paymentType === PaymentType.Interest,
    );

    for (const p of interestOnly) {
      expect(p.total).toBe(p.interest);
    }
  });

  it("final payment total equals principal plus interest", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-06-30",
      fixedRate("2024-01-01", rate),
    );

    const last = payments[payments.length - 1];
    expect(last.total).toBe(last.principal + last.interest);
  });

  it("payment dates are in chronological order", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2025-01-31",
      fixedRate("2024-01-01", rate),
    );

    for (let i = 1; i < payments.length; i++) {
      expect(payments[i].paymentDate > payments[i - 1].paymentDate).toBe(true);
    }
  });

  it("exactly one payment has type PrincipalAndInterest", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-12-31",
      fixedRate("2024-01-01", rate),
    );

    const principalPayments = payments.filter(
      (p) => p.paymentType === PaymentType.PrincipalAndInterest,
    );

    expect(principalPayments).toHaveLength(1);
    expect(principalPayments[0]).toBe(payments[payments.length - 1]);
  });

  it("different rates produce different interest amounts", () => {
    const lowRate = generateLoanPayments(
      100_000, "2024-01-01", "2024-03-31", fixedRate("2024-01-01", 0.04),
    );
    const highRate = generateLoanPayments(
      100_000, "2024-01-01", "2024-03-31", fixedRate("2024-01-01", 0.12),
    );

    expect(highRate[0].interest).toBeGreaterThan(lowRate[0].interest);
  });

  it("all interest values are non-negative", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-12-31",
      fixedRate("2024-01-01", rate),
    );

    for (const p of payments) {
      expect(p.interest).toBeGreaterThanOrEqual(0);
    }
  });

  it("handles a 12-month loan with correct payment count", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-12-31",
      fixedRate("2024-01-01", rate),
    );

    // 12 months: 11 interest-only + 1 merged principal+interest
    expect(payments).toHaveLength(12);

    const interestOnly = payments.filter(
      (p) => p.paymentType === PaymentType.Interest,
    );
    expect(interestOnly).toHaveLength(11);
  });
});

// --- Rate history tests (mid-month rate changes) ---

describe("generateLoanPayments with rate history", () => {
  it("pro-rates interest when rate changes mid-month", () => {
    // Rate changes from 6% to 12% on Jan 16
    // Days 1-15 at 6%: 100,000 * 0.06 * (15/360) = 250.00
    // Days 16-30 at 12%: 100,000 * 0.12 * (15/360) = 500.00
    // Total: 750.00
    const rateHistory: RateHistory = new Map([
      ["2024-01-01", 0.06],
      ["2024-01-16", 0.12],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-01-31",
      rateHistory,
    );

    expect(payments).toHaveLength(1);
    expect(payments[0].interest).toBeCloseTo(750.0, 2);
  });

  it("uses correct rate for each month when rate changes between months", () => {
    // 6% for Jan, then 12% starting Feb 1
    const rateHistory: RateHistory = new Map([
      ["2024-01-01", 0.06],
      ["2024-02-01", 0.12],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-02-29",
      rateHistory,
    );

    // Jan: 100,000 * 0.06 * (30/360) = 500.00
    expect(payments[0].interest).toBeCloseTo(500.0, 2);
    // Feb: 100,000 * 0.12 * (30/360) = 1000.00
    expect(payments[1].interest).toBeCloseTo(1000.0, 2);
  });

  it("handles multiple rate changes within a single month", () => {
    // Rate: 6% days 1-9, 8% days 10-19, 12% days 20-30
    const rateHistory: RateHistory = new Map([
      ["2024-03-01", 0.06],
      ["2024-03-10", 0.08],
      ["2024-03-20", 0.12],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-03-01",
      "2024-03-31",
      rateHistory,
    );

    // Days 1-9 (9 days) at 6%: 100,000 * 0.06 * (9/360) = 150.00
    // Days 10-19 (10 days) at 8%: 100,000 * 0.08 * (10/360) = 222.22
    // Days 20-30 (11 days) at 12%: 100,000 * 0.12 * (11/360) = 366.67
    // Total ≈ 738.89
    expect(payments).toHaveLength(1);
    expect(payments[0].interest).toBeCloseTo(738.89, 2);
  });

  it("uses the most recent rate when no rate change occurs in a month", () => {
    // Rate set before the loan starts — should carry forward
    const rateHistory: RateHistory = new Map([
      ["2023-12-01", 0.10],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-02-29",
      rateHistory,
    );

    // Both months at 10%: 100,000 * 0.10 * (30/360) = 833.33
    expect(payments[0].interest).toBeCloseTo(833.33, 2);
    expect(payments[1].interest).toBeCloseTo(833.33, 2);
  });

  it("rate change on 1st of month applies to the entire month", () => {
    const rateHistory: RateHistory = new Map([
      ["2024-01-01", 0.06],
      ["2024-02-01", 0.12],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-03-31",
      rateHistory,
    );

    // Jan at 6%, Feb and Mar at 12%
    expect(payments[0].interest).toBeCloseTo(500.0, 2);
    expect(payments[1].interest).toBeCloseTo(1000.0, 2);
    expect(payments[2].interest).toBeCloseTo(1000.0, 2);
  });
});
