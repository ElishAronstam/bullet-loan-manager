import { PaymentType } from "../../db/entities/Payment";
import { generateLoanPayments } from "../loanPaymentsGenerator";

describe("generateLoanPayments", () => {
  const fixedRate = new Map([["2024-01-01", 0.08]]); // 8%

  it("generates monthly interest-only payments and a final principal+interest payment", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-04-30",
      fixedRate,
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
    expect(last.paymentType).toBe(PaymentType.PrincipalInterest);
    expect(last.principal).toBe(100_000);
    expect(last.remainingBalance).toBe(0);
  });

  it("calculates interest using 30/360 method", () => {
    // 100,000 * 0.08 * (30/360) = 666.67
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-03-31",
      fixedRate,
    );

    expect(payments[0].interest).toBeCloseTo(666.67, 2);
    expect(payments[0].total).toBeCloseTo(666.67, 2);
  });

  it("handles a single-month loan (start and end in same month)", () => {
    const payments = generateLoanPayments(
      50_000,
      "2024-03-01",
      "2024-03-31",
      fixedRate,
    );

    expect(payments).toHaveLength(1);
    expect(payments[0].paymentType).toBe(PaymentType.PrincipalInterest);
    expect(payments[0].principal).toBe(50_000);
    expect(payments[0].remainingBalance).toBe(0);
  });

  it("merges final payment when end date falls on last day of a payment month", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-01-31",
      fixedRate,
    );

    expect(payments).toHaveLength(1);
    expect(payments[0].paymentType).toBe(PaymentType.PrincipalInterest);
    expect(payments[0].principal).toBe(100_000);
    expect(payments[0].total).toBe(100_000 + payments[0].interest);
  });

  it("pro-rates interest when rate changes mid-month", () => {
    // Rate changes on Jan 16: 8% for days 1-15 (15 days), 10% for days 16-30 (15 days)
    const rateHistory = new Map([
      ["2024-01-01", 0.08],
      ["2024-01-16", 0.1],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-02-28",
      rateHistory,
    );

    // Jan interest: 100,000 * 0.08 * (15/360) + 100,000 * 0.10 * (15/360)
    // = 333.33 + 416.67 = 750.00
    expect(payments[0].interest).toBeCloseTo(750.0, 2);
  });

  it("sets correct payment dates on last day of each month", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-04-30",
      fixedRate,
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
      fixedRate,
    );

    const last = payments[payments.length - 1];
    expect(last.paymentDate).toBe("2024-06-15");
    expect(last.paymentType).toBe(PaymentType.PrincipalInterest);
  });

  it("spans multiple years correctly", () => {
    const payments = generateLoanPayments(
      100_000,
      "2023-11-01",
      "2024-02-29",
      fixedRate,
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
      fixedRate,
    );

    // Jan 31, Feb 29 interest-only + Mar 15 principal+interest
    expect(payments).toHaveLength(3);
    expect(payments[0].paymentType).toBe(PaymentType.Interest);
    expect(payments[1].paymentType).toBe(PaymentType.Interest);
    expect(payments[2].paymentType).toBe(PaymentType.PrincipalInterest);
    expect(payments[2].paymentDate).toBe("2024-03-15");
    expect(payments[2].principal).toBe(100_000);
  });

  it("handles multiple rate changes within a single month", () => {
    const rateHistory = new Map([
      ["2024-01-01", 0.06],
      ["2024-01-11", 0.08],
      ["2024-01-21", 0.10],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-02-28",
      rateHistory,
    );

    // Jan: 10 days @ 6% + 10 days @ 8% + 10 days @ 10%
    // = 100,000 * 0.06 * (10/360) + 100,000 * 0.08 * (10/360) + 100,000 * 0.10 * (10/360)
    // = 166.67 + 222.22 + 277.78 = 666.67
    expect(payments[0].interest).toBeCloseTo(666.67, 2);
  });

  it("applies new rate when rate changes on the 1st of a month", () => {
    const rateHistory = new Map([
      ["2024-01-01", 0.08],
      ["2024-02-01", 0.12],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-02-29",
      rateHistory,
    );

    // Jan: 100,000 * 0.08 * (30/360) = 666.67
    expect(payments[0].interest).toBeCloseTo(666.67, 2);
    // Feb: 100,000 * 0.12 * (30/360) = 1000.00
    expect(payments[1].interest).toBeCloseTo(1000.0, 2);
  });

  it("handles February in a non-leap year", () => {
    const payments = generateLoanPayments(
      100_000,
      "2023-02-01",
      "2023-02-28",
      fixedRate,
    );

    expect(payments).toHaveLength(1);
    expect(payments[0].paymentDate).toBe("2023-02-28");
    expect(payments[0].paymentType).toBe(PaymentType.PrincipalInterest);
  });

  it("total of all payments equals principal plus total interest", () => {
    const payments = generateLoanPayments(
      200_000,
      "2024-01-01",
      "2024-06-30",
      fixedRate,
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
      fixedRate,
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
      fixedRate,
    );

    expect(payments).toHaveLength(3);
    // 1 * 0.08 * (30/360) = 0.0067 -> rounds to 0.01
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
      fixedRate,
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
      fixedRate,
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
      fixedRate,
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
      fixedRate,
    );

    const last = payments[payments.length - 1];
    expect(last.total).toBe(last.principal + last.interest);
  });

  it("payment dates are in chronological order", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2025-01-31",
      fixedRate,
    );

    for (let i = 1; i < payments.length; i++) {
      expect(payments[i].paymentDate > payments[i - 1].paymentDate).toBe(true);
    }
  });

  it("exactly one payment has type PrincipalInterest", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-12-31",
      fixedRate,
    );

    const principalPayments = payments.filter(
      (p) => p.paymentType === PaymentType.PrincipalInterest,
    );

    expect(principalPayments).toHaveLength(1);
    expect(principalPayments[0]).toBe(payments[payments.length - 1]);
  });

  it("uses rate effective before loan start when no rate on exact start date", () => {
    const rateHistory = new Map([
      ["2023-06-01", 0.10],
      ["2024-03-01", 0.12],
    ]);

    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-04-30",
      rateHistory,
    );

    // Jan and Feb use 10% rate (from 2023-06-01)
    // 100,000 * 0.10 * (30/360) = 833.33
    expect(payments[0].interest).toBeCloseTo(833.33, 2);
    expect(payments[1].interest).toBeCloseTo(833.33, 2);

    // Mar uses 12% rate (from 2024-03-01)
    // 100,000 * 0.12 * (30/360) = 1000.00
    expect(payments[2].interest).toBeCloseTo(1000.0, 2);
  });

  it("all interest values are non-negative", () => {
    const payments = generateLoanPayments(
      100_000,
      "2024-01-01",
      "2024-12-31",
      fixedRate,
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
      fixedRate,
    );

    // 12 months: 11 interest-only + 1 merged principal+interest
    expect(payments).toHaveLength(12);

    const interestOnly = payments.filter(
      (p) => p.paymentType === PaymentType.Interest,
    );
    expect(interestOnly).toHaveLength(11);
  });
});
